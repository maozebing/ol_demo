<template>
  <div class="bmap-page">
    <!--地图元素-->
    <div id="mapNode" style="height: 100%;width: 100%"></div>
  </div>
</template>
<script>
  import saveAs from 'file-saver';
  import MapUtil from "../../common/utils/ol-util";
  import echarts from 'echarts';
  import EChartsLayer from 'ol-echarts';
  import ADLayer from 'openlayers_echart';
  import mapJson from '../../../static/json/scatter.json';

  let mapHelper = new MapUtil(window.mapProjection, window.dataProjection);
  let olMap;
  export default {
    data() {
      return {
        echartsLayer: '',
        mapData: '',
        geoCoordMap: ''
      }
    },
    methods: {
      //创建地图
      createMap() {
        let mapUrl = window.amapUrl;
        let target = 'mapNode';
        let extent = baseDefautExtent;
        let center = baseDefautCenter;
        let minZoom = baseDefautMinZoom;
        let maxZoom = baseDefautMaxZoom;
        let zoom = 5;
        //地图对象
        olMap = mapHelper.createTileMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom);

        this.createChart()
      },
      createChart() {
        let _this = this;
        /*_this.echartsLayer = new EChartsLayer(null, {
          hideOnMoving: false,
          hideOnZooming: false,
          forcedPrecomposeRerender: true
        });
        _this.echartsLayer.appendTo(olMap);*/

        let mapData = mapJson.locations;
        this.geoCoordMap = mapJson.coordinates;
        let option = {
          title: {
            text: '全国主要城市空气质量',
            subtext: 'data from PM25.in',
            sublink: 'http://www.pm25.in',
            left: 'center',
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'item'
          },
          openlayers: {},
          legend: {
            orient: 'vertical',
            y: 'top',
            x: 'right',
            data: ['pm2.5'],
            textStyle: {
              color: '#fff'
            }
          },
          series: [
            {
              name: 'pm2.5',
              type: 'scatter',
              data: _this.convertData(mapData),
              symbolSize: function (val) {
                return val[2] / 10;
              },
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: '#ddb926'
                }
              }
            },
            /*{
              name: 'Top 5',
              type: 'scatter',
              data: _this.convertData(mapData.sort(function (a, b) {
                return b.value - a.value;
              }).slice(0, 6)),
              symbolSize: function (val) {
                return val[2] / 10;
              },
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: false,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: '#f4e925',
                  shadowBlur: 10,
                  shadowColor: '#333'
                }
              },
              zlevel: 1
            }*/
          ]
        };
        //_this.echartsLayer.setChartOptions(option);

        let oe = new ADLayer(option,olMap,echarts);
        oe.render()

      },
      convertData(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = this.geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.createMap()
      })
    },
    beforeDestroy() {
      this.echartsLayer.dispose()
    },
    destroyed() {
      this.echartsLayer.dispose()
    }
  }
</script>
<style scoped>
  @import url('../../assets/css/popup.css');

  .bmap-page {
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
