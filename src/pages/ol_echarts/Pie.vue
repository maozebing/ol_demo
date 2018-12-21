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
  import mapJson from '../../../static/json/scatter.json';

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
        let center = baseDefautCenter;
        let minZoom = baseDefautMinZoom;
        let maxZoom = baseDefautMaxZoom;
        let zoom = 5;
        //地图对象
        olMap = mapHelper.createTileMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom);

        this.createChart()
      },
      //创建图表
      createChart() {
        let _this = this;
        _this.echartsLayer = new EChartsLayer(null);
        _this.echartsLayer.appendTo(olMap);

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '30',
              coordinates: [110.53450137499999, 33.44104525],
              data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            {
              name: '访问来源',
              type: 'pie',
              radius: '30',
              coordinates: [113.53450137499999, 34.44104525],
              data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            },
            {
              name: '访问来源',
              type: 'pie',
              radius: '30',
              coordinates: [110.53450137499999, 38.44104525],
              data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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
