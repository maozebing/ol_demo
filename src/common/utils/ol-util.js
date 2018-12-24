import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import Heatmap from 'ol/layer/Heatmap.js';
import Overlay from 'ol/Overlay';
import {TileArcGISRest, Cluster, XYZ, OSM} from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import {Style, Icon, Circle, Stroke, Fill, Text} from 'ol/style';
import Select from 'ol/interaction/Select';
import {singleClick} from 'ol/events/condition';
import LineString from 'ol/geom/LineString';
import {KML, GeoJSON} from 'ol/format';

/**
 * 地图帮助类
 */
class MapUtil {
  /**
   * 构造函数
   * @param mapProjection 地图坐标系
   * @param dataProjection 数据坐标系
   */
  constructor(mapProjection, dataProjection) {
    this.mapProjection = mapProjection;
    this.dataProjection = dataProjection;
  }

  /**
   * 创建AicGis地图
   * @param mapUrl 服务地址
   * @param target 地图div元素的名称
   * @param extent 需要展现的范围
   * @param center 中心点
   * @param minZoom 最小缩放级别
   * @param maxZoom 最大缩放级别
   * @param zoom 初始化缩放级别
   */
  createAicGisMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom) {
    let layers = [
      new TileLayer({
        extent: extent,
        source: new TileArcGISRest({
          crossOrigin: 'anonymous',
          url: mapUrl
        })
      })
    ];
    let map = new Map({
      layers: layers,
      target: target,
      view: new View({
        projection: this.mapProjection,
        center: center,
        minZoom: minZoom,
        maxZoom: maxZoom,
        zoom: zoom
      }),
    });
    return map;
  }

  /**
   * 创建瓦片地图
   * @param mapUrl 服务地址
   * @param target 地图div元素的名称
   * @param extent 需要展现的范围
   * @param center 中心点
   * @param minZoom 最小缩放级别
   * @param maxZoom 最大缩放级别
   * @param zoom 初始化缩放级别
   */
  createTileMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom) {
    let layers = [
      new TileLayer({
        extent: extent,
        source: new XYZ({
          crossOrigin: 'anonymous',
          url: mapUrl
        })
      })
    ];
    let map = new Map({
      layers: layers,
      target: target,
      view: new View({
        projection: this.mapProjection,
        center: center,
        minZoom: minZoom,
        maxZoom: maxZoom,
        zoom: zoom
      }),
    });
    return map;
  }

  /**
   * 创建GeoJson地图
   * @param mapUrl 服务地址
   * @param target 地图div元素的名称
   * @param extent 需要展现的范围
   * @param center 中心点
   * @param minZoom 最小缩放级别
   * @param maxZoom 最大缩放级别
   * @param zoom 初始化缩放级别
   */
  createGeoJsoneMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom) {
    let style = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
      }),
      stroke: new Stroke({
        color: '#319FD3',
        lineDash:[1,2,3,4,5,6],//虚线
        width: 1
      }),
      text: new Text({
        font: '12px Calibri,sans-serif',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 3
        })
      })
    });
    let layers = [
      new VectorLayer({
        source: new VectorSource({
          url: mapUrl,
          format: new GeoJSON()
        }),
        style: function(feature) {
          //style.getText().setText(feature.get('name'));
          style.getFill().setColor(feature.get('color'));
          return style;
        }
      })
    ];
    let map = new Map({
      layers: layers,
      target: target,
      view: new View({
        projection: this.mapProjection,
        center: center,
        minZoom: minZoom,
        maxZoom: maxZoom,
        zoom: zoom
      }),
    });
    return map;
  }

  /**
   * 添加非聚合图层
   * @param olMap
   * @returns {ol.layer.Vector}
   */
  addLayer(map) {
    let layer = new VectorLayer({
      source: new VectorSource()
    });
    map.addLayer(layer);
    return layer;
  }

  /**
   * 清除图层数据
   * @param layer
   */
  clearLayerData(layer) {
    layer.getSource().clear();
  }

  /**
   * 添加聚合图层
   * @param map
   */
  addClusterLayer(map) {
    let clusterSource = new Cluster({
      distance: 20,
      source: new VectorSource()
    });
    let layer = new VectorLayer({
      source: clusterSource,
      style: function (feature) {
        let features = feature.get('features');
        let style;
        if (features.length > 1) {
          style = new Style({
            image: new Circle({
              radius: 10,
              stroke: new Stroke({
                color: '#fff'
              }),
              fill: new Fill({
                color: '#3399CC'
              })
            }),
            text: new Text({
              text: features.length.toString(),
              fill: new Fill({
                color: '#fff'
              })
            })
          });
        } else {
          style = features[0].style_;
        }
        return style;
      }
    });
    map.addLayer(layer);
    return layer;
  }

  /**
   * 清除聚合图层数据
   * @param layer
   */
  clearClusterLayerData(layer) {
    layer.getSource().getSource().clear();
  }

  /**
   * 添加热力图层(加载KML文件)
   * @param map 地图对象
   * @param data KML文件
   */
  addHeatmapLayerByKML(map, data) {
    let heatmapLayer = new Heatmap({
      gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],//热力图渲染色带，默认可不设置
      radius: 8,//每个像素渲染点半径，可根据实际数据效果进行调整
      blur: 15,//模糊度，可根据实际数据效果进行调整
      weight: 'weight',//权重值，热力图根据这个值进行热力渲染；图层中每个feature都要有这个属性；属性名默认weight，可以改成自己的字段名；注：0~1之间。
      renderModed: 'image',//图层渲染方式，image和vector分别为栅格和矢量，第一个渲染速度快；后者慢，ol5新增加的属性，对于大量数据渲染有利
      source: new VectorSource({
        url: data,
        format: new KML({
          extractStyles: false
        })
      })//矢量source
    });
    map.addLayer(heatmapLayer);
    return heatmapLayer;
  }

  /**
   * 添加热力图层(加载GeoJSON数据)
   * @param map 地图对象
   * @param data GeoJSON数据
   */
  addHeatmapLayerByJson(map, data) {
    let heatmapLayer = new Heatmap({
      gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],//热力图渲染色带，默认可不设置
      radius: 8,//每个像素渲染点半径，可根据实际数据效果进行调整
      blur: 15,//模糊度，可根据实际数据效果进行调整
      weight: 'weight',//权重值，热力图根据这个值进行热力渲染；图层中每个feature都要有这个属性；属性名默认weight，可以改成自己的字段名；注：0~1之间。
      renderModed: 'image',//图层渲染方式，image和vector分别为栅格和矢量，第一个渲染速度快；后者慢，ol5新增加的属性，对于大量数据渲染有利
      source: new VectorSource({
        features: (new GeoJSON()).readFeatures(data)
      })//矢量source
    });
    map.addLayer(heatmapLayer);
    return heatmapLayer;
  }

  /**
   * 移除图层
   * @param olMap
   * @param layer
   */
  removeLayer(map, layer) {
    map.removeLayer(layer);
  }

  /**
   * 添加覆盖物图层
   * @param map
   * @param element
   * @returns {Overlay}
   */
  addOverlay(map, element) {
    let overlay = new Overlay(({
      element: element,
      autoPan: false,
    }));
    map.addOverlay(overlay);
    return overlay;
  }

  /**
   * 清除覆盖物图层位置
   * @param overlay 图层
   */
  clearOverlayPosition(overlay) {
    overlay.setPosition(undefined);
  }

  /**
   * 设置覆盖物图层位置
   * @param overlay 图层
   * @param coordinate 坐标
   */
  setOverlayPosition(overlay, coordinate) {
    overlay.setPosition(coordinate);
  }

  /**
   * 创建Feature
   * @param longitude 经度
   * @param latitude 维度
   * @param style 样式
   * @param data 数据
   * @returns {Feature|fidParser}
   */
  createFeature(longitude, latitude, style, data) {
    let transformPoint = new Point([longitude, latitude]);
    var feature = new Feature({
      geometry: transformPoint,
      data: data
    });
    if (style) {
      feature.setStyle(style);
    }
    return feature;
  }

  /**
   * Feature样式
   * @param image 图片
   * @returns {*}
   */
  createFeatureStyle(image) {
    let featureStyle = new Style({
      image: new Icon({
        crossOrigin: 'anonymous',
        src: image,
        anchor: [0.5, 1.2],    // 设置图标位置
      }),
    });
    return featureStyle;
  }

  /**
   * 图层添加数据
   * @param layer
   * @param features
   */
  addFeatures(layer, features) {
    layer.getSource().addFeatures(features);
  }

  /**
   * 图层添加数据
   * @param layer
   * @param features
   */
  addClusterFeatures(layer, features) {
    layer.getSource().getSource().addFeatures(features);
  }

  /**
   * 地图点击事件
   * @param olMap
   * @param clickFun
   * @returns {Select}
   */
  addMapClick(map, clickFun) {
    let selectClick = new Select({
      condition: singleClick
    });
    map.addInteraction(selectClick);
    selectClick.on('select', function (event) {
      if (event.selected[0] != undefined) {
        clickFun(event)
        selectClick.getFeatures().clear();
      }
    });
    return selectClick;
  }

  /**
   *  创建线Feature
   * @param pointList e.g. pointList = [
   [114.01,34.01],
   [114.01,34.21]
   ];
   * @param style
   */
  createLineFeature(pointList, style) {
    //实例一个线(标记点)
    let geometry = new LineString(pointList); //线,Point 点,Polygon 面);
    //绘制线的数据
    let feature = new Feature(geometry);
    feature.setStyle(style);
    return feature;
  }

  /**
   * LineFeature样式
   * @param color 颜色
   * @param width 宽度
   * @returns {Style}
   */
  createLineFeatureStyle(color, width) {
    let featureStyle = new Style({
      stroke: new Stroke({
        color: color,
        width: width
      })
    });
    return featureStyle;
  }

  /**
   * 图层添加数据
   * @param layer
   * @param feature
   */
  addLineFeature(layer, feature) {
    layer.getSource().addFeature(feature);
  }

}

export default MapUtil
