<template>
  <div class="bmap-page">
    <!--地图元素-->
    <div id="mapNode" style="height: 100%;width: 100%"></div>
    <div style="display:none">
      <div id="pie" style="width: 200px;height: 150px">

      </div>
    </div>
  </div>
</template>
<script>
  import saveAs from 'file-saver';
  import MapUtil from "../common/utils/ol-util";
  import echarts from 'echarts';

  let mapHelper = new MapUtil(window.mapProjection, window.dataProjection);
  let olMap;
  let olHeatmapLayer;
  export default {
    data() {
      return {}
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
        let zoom = baseDefautZoom;
        //地图对象
        olMap = mapHelper.createTileMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom);

        this.createPie()
      },
      createPie() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('pie'));
        // 绘制图表
        myChart.setOption({
          tooltip: {},
          xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        });

        let pieOverlay = mapHelper.addOverlay(olMap, document.getElementById('pie'));
        mapHelper.setOverlayPosition(pieOverlay,[114,34]);


      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.createMap()
      })
    },
    destroyed() {

    }
  }
</script>
<style scoped>
  @import url('../assets/css/popup.css');

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
