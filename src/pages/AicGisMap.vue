<template>
  <div class="aicGis-page" ref="aicGisPage">
    <!--地图元素-->
    <div id="mapNode" style="height: 100%;width: 100%"></div>
    <!--控制按钮-->
    <div class="control">
      <Button type="primary" @click="addFeatures">添加非聚合标记</Button>
      <Button type="primary" @click="clearFeatures">清除非聚合标记</Button>
      <Button type="primary" @click="addClusterFeatures">添加聚合标记</Button>
      <Button type="primary" @click="clearClusterFeatures">清除聚合标记</Button>
      <Button type="primary" @click="addLineFeatures">添加线</Button>
      <Button type="primary" @click="clearLineFeatures">清除线</Button>
      <Button type="primary" @click="exportMap">下载地图</Button>
    </div>
    <!--弹出层结构-->
    <div id="popup" class="popup">
      <div class="popup-content">
        <div class="popup-panel">
          <div class="popup-panel-close" id="popup-closer"></div>
          <div class="popup-panel-bg"></div>
          <div class="popup-panel-position">
            <div class="line"></div>
            <div class="point-easeing">
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
            </div>
          </div>
          <div class="popup-panel-content" id="popup_content">

          </div>
        </div>
      </div>
    </div>
    <!--弹出层内容-->
    <div style="display: none">
      <div ref="popup_content" style="padding: 0;color: white;width:291px;text-align: left ">
        <Row>
          <i-col span="6">
            <span>资源名称：</span>
          </i-col>
          <i-col span="18">
            <a @click="popupClick(selecteResData)" style="display: inline-block;">{{selecteResData.name}}</a>
          </i-col>
        </Row>
        <Row>
          <i-col span="6">
            <span>资源经度：</span>
          </i-col>
          <i-col span="18">
            <span>{{selecteResData.longitude}}</span>
          </i-col>
        </Row>
        <Row>
          <i-col span="6">
            <span>资源维度：</span>
          </i-col>
          <i-col span="18">
            <span>{{selecteResData.latitude}}</span>
          </i-col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
  import saveAs from 'file-saver';
  import MapUtil from "../common/utils/ol-util"

  let mapHelper = new MapUtil(window.mapProjection, window.dataProjection);
  let olMap;
  let olLayer;
  let olClusterLayer;
  let olPopupOverlay;
  let olLineLayer;
  export default {
    data() {
      return {
        mapHeight: 400,
        layerDatas: [],
        selecteResData: {
          name: '',
          longitude: '',
          latitude: ''
        }
      }
    },
    methods: {
      refresh() {
        this.mapHeight = this.$refs.aicGisPage.clientHeight;
      },
      createData() {
        for (let i = 0; i < 100; i++) {
          let x = 114 + Math.random();
          let y = 34 + Math.random();
          this.layerDatas.push({
            name: '资源' + i + 1,
            longitude: x,
            latitude: y
          })
        }
      },
      //创建地图
      createMap() {
        let mapUrl = aicGisMapUrl;
        let target = 'mapNode';
        let extent = baseDefautExtent;
        let center = baseDefautCenter;
        let minZoom = baseDefautMinZoom;
        let maxZoom = baseDefautMaxZoom;
        let zoom = baseDefautZoom;
        //地图对象
        olMap = mapHelper.createAicGisMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom);

        let width = this.$refs.aicGisPage.clientWidth;
        let height = this.$refs.aicGisPage.clientHeight;
        olMap.setSize([width, height]);

        //非聚合图层对象
        olLayer = mapHelper.addLayer(olMap);

        //聚合图层对象
        olClusterLayer = mapHelper.addClusterLayer(olMap);

        //线图层对象
        olLineLayer = mapHelper.addLayer(olMap);

        //添加地图点击事件
        this.addMapClick();

        //添加弹出框图层
        let container = document.getElementById('popup');
        olPopupOverlay = mapHelper.addOverlay(olMap, container);

        //弹出层关闭按钮事件
        let closer = document.getElementById('popup-closer');
        closer.onclick = function () {
          mapHelper.clearOverlayPosition(olPopupOverlay);
          closer.blur();
          return false;
        };
      },
      //添加地图点击事件
      addMapClick() {
        let _this = this;
        mapHelper.addMapClick(olMap, function (event) {
          let feature = event.selected[0];
          let clusterFeatures = feature.get('features');
          let data;
          if (clusterFeatures == undefined) {
            //获取非聚合标记数据
            data = feature.values_.data;
          } else {
            //获取聚合标记数据
            if (clusterFeatures.length > 1) {
              return;
            }
            data = feature.get('features')[0].values_.data;
          }
          _this.showPopup(data);
        });
      },

      //添加标记
      addFeatures() {
        //清除图层数据
        mapHelper.clearLayerData(olLayer);
        //定义图标
        let cmsImage = require('../../static/images/marker/qingbaoban24.png');
        let featureStyle = mapHelper.createFeatureStyle(cmsImage);
        let features = [];
        this.layerDatas.forEach(v => {
          let feature = mapHelper.createFeature(v.longitude, v.latitude, featureStyle, v);
          features.push(feature);
        });
        mapHelper.addFeatures(olLayer, features);
      },
      //清除非聚合标记
      clearFeatures() {
        //清除图层数据
        mapHelper.clearLayerData(olLayer);
      },

      //添加聚合标记
      addClusterFeatures() {
        //清除图层数据
        mapHelper.clearLayerData(olClusterLayer);
        //定义图标
        let cmsImage = require('../../static/images/marker/qingbaoban24.png');
        let featureStyle = mapHelper.createFeatureStyle(cmsImage);
        let features = [];
        this.layerDatas.forEach(v => {
          let feature = mapHelper.createFeature(v.longitude, v.latitude, featureStyle, v);
          features.push(feature);
        });
        mapHelper.addClusterFeatures(olClusterLayer, features);
      },
      //清除聚合标记
      clearClusterFeatures() {
        //清除图层数据
        mapHelper.clearClusterLayerData(olClusterLayer);
      },

      //添加线
      addLineFeatures() {
        let pointList = [
          [114.01, 34.01],
          [114.01, 34.21],
          [114.01, 34.31],
          [114.01, 34.41],
          [114.11, 34.51],
          [114.21, 34.51],
          [114.31, 34.51],
          [114.41, 34.51]
        ];
        let style = mapHelper.createLineFeatureStyle('red', 2);
        let lineFeature = mapHelper.createLineFeature(pointList, style);
        mapHelper.addLineFeature(olLineLayer, lineFeature);
      },
      //清除线
      clearLineFeatures() {
        //清除图层数据
        mapHelper.clearLayerData(olLineLayer);
      },

      //弹出层
      showPopup(data) {
        mapHelper.clearOverlayPosition(olPopupOverlay);
        let content = document.getElementById('popup_content');
        this.selecteResData.name = data.name;
        this.selecteResData.longitude = data.longitude;
        this.selecteResData.latitude = data.latitude;
        content.appendChild(this.$refs.popup_content);
        mapHelper.setOverlayPosition(olPopupOverlay, [data.longitude, data.latitude]);
      },
      //弹出层内点击事件
      popupClick(data) {
        alert("你选中了点：[" + data.longitude + "," + data.latitude + "]");
      },

      //地图导出
      exportMap() {
        olMap.once('rendercomplete', function (event) {
          let canvas = event.context.canvas;
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
          } else {
            console.log(canvas)
            canvas.toBlob(function (blob) {
              saveAs(blob, 'map.png');
            });
          }
        });
        olMap.renderSync();
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.refresh()
        this.createData()
        this.createMap()
      })
      this.$root.$on('fullScreen', () => {
        this.mapHeight = this.$refs.aicGisPage.clientHeight;
      });
    },
    destroyed() {
      this.$root.$off('fullScreen')
    }
  }
</script>
<style scoped>
  @import url('../assets/css/popup.css');

  .aicGis-page {
    height: 100%;
  }

  .control {
    width: 100%;
    height: 50px;
    text-align: right;
    position: absolute;
    cursor: pointer;
    right: 0px;
    top: 46px;
    padding: 8px;
    z-index: 1002;
    background: #ffffff;
  }
</style>
