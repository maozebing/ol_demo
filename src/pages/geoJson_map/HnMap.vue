<template>
  <div class="amap-page">
    <!--地图元素-->
    <div id="mapNode" style="height: 100%;width: 100%"></div>
  </div>
</template>
<script>
  import saveAs from 'file-saver';
  import MapUtil from "../../common/utils/ol-util";
  import hnJson from '../../../static/map/hn.json';

  let mapHelper = new MapUtil(window.mapProjection, window.dataProjection);
  let olMap;
  let olLayer;
  export default {
    data() {
      return {

      }
    },
    methods: {
      //创建地图
      createMap() {
        let mapUrl = '../../../static/map/hn.json';
        let target = 'mapNode';
        let extent = baseDefautExtent;
        let center = baseDefautCenter;
        let minZoom = baseDefautMinZoom;
        let maxZoom = baseDefautMaxZoom;
        let zoom = baseDefautZoom;
        //地图对象
        olMap = mapHelper.createGeoJsoneMap(mapUrl, target, extent, center, minZoom, maxZoom, zoom);

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
  @import url('../../assets/css/popup.css');

  .amap-page {
    height: 100%;
    background-color: #0E1A22;
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
    z-index: 2;
    background: #ffffff;
  }
</style>
