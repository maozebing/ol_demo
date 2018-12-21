<template>
  <div class="bmap-page">
    <!--地图元素-->
    <div id="mapNode" style="height: 100%;width: 100%"></div>
  </div>
</template>
<script>
  import saveAs from 'file-saver';
  import MapUtil from "../../common/utils/ol-util";
  import EChartsLayer from 'ol-echarts';
  import echarts from 'echarts';
  import mapJson from '../../../static/json/lines-bus.json';

  let mapHelper = new MapUtil(window.mapProjection, window.dataProjection);
  let olMap;
  export default {
    data() {
      return {
        echartsLayer: '',
      }
    },
    methods: {
      //创建地图
      createMap() {
        let mapUrl = window.amapUrl;
        let target = 'mapNode';
        let extent = baseDefautExtent;
        let center = [116.28245, 39.92121];
        let minZoom = baseDefautMinZoom;
        let maxZoom = baseDefautMaxZoom;
        let zoom = 10;
        //地图对象
        olMap = mapHelper.createTileMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom);

        this.createChart()
      },
      //创建图表
      createChart() {
        let _this = this;
        _this.echartsLayer = new EChartsLayer(null);
        _this.echartsLayer.appendTo(olMap);

        let hStep = 300 / (mapJson.length - 1);
        let busLines = [].concat.apply([], mapJson.map(function (busLine, idx) {
          let prevPt;
          let points = [];
          for (let i = 0; i < busLine.length; i += 2) {
            let pt = [busLine[i], busLine[i + 1]];
            if (i > 0) {
              pt = [
                prevPt[0] + pt[0],
                prevPt[1] + pt[1]
              ];
            }
            prevPt = pt;

            points.push([pt[0] / 1e4, pt[1] / 1e4]);
          }
          return {
            'coords': points,
            'lineStyle': {
              'normal': {
                'color': echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
              }
            }
          };
        }));


        let option = {
          'series': [
            {
              'type': 'lines',
              'polyline': true,
              'data': busLines,
              'lineStyle': {
                'normal': {
                  'width': 0
                }
              },
              'effect': {
                'constantSpeed': 20,
                'show': true,
                'trailLength': 0.5,
                'symbolSize': 1.5
              },
              'zlevel': 1
            }
          ]
        };
        _this.echartsLayer.setChartOptions(option);
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
