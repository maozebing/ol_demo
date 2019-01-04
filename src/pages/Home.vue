<template>
  <div class="home-page">
    <div class="system-title">
      <Menu mode="horizontal" theme="dark" :active-name="menuActiveName" @on-select="handleMenu" ref="systemMenu"
            class="system-title-menu">
        <div class="header-logo">
          <span style="font-size: 26px;font-weight:bold;color: #00b0ff">Openlayers</span>
          <span style="font-size: 26px;font-weight:bold;color: #00b0ff">地图封装</span>
        </div>
        <div style="margin-left: 30px">
          <div class="header-nav">
            <MenuItem name="aicGisMap">
              <Icon type="ios-paper" />
              AicGisMap
            </MenuItem>
            <MenuItem name="amap">
              <Icon type="ios-people" />
              Amap
            </MenuItem>
            <Submenu name="3">
              <template slot="title">
                <Icon type="stats-bars"></Icon>
                地图图表
              </template>
              <MenuItem name="scatter">Scatter</MenuItem>
              <MenuItem name="migration">Migration</MenuItem>
              <MenuItem name="pie">Pie</MenuItem>
              <MenuItem name="lineBus">LineBus</MenuItem>
            </Submenu>
            <Submenu name="4">
              <template slot="title">
                <Icon type="stats-bars"></Icon>
                GEO地图
              </template>
              <MenuItem name="hnMap">河南省地图</MenuItem>
            </Submenu>
          </div>
        </div>
      </Menu>
    </div>
    <div class="content">
      <transition name="move" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>


</template>

<script>

  export default {
    name: 'Home',
    data() {
      return {
        menuActiveName: 'aicGisMap',
      }
    },
    computed: {},
    methods: {
      handleMenu(name) {
        sessionStorage.setItem("menuActive", name);
        this.$router.push({name: name});
      },
      menuActive() {
        if (sessionStorage.getItem("menuActive") == null) {
          this.menuActiveName = "aicGisMap";
        } else {
          this.menuActiveName = sessionStorage.getItem("menuActive");
        }
        this.$nextTick(() => {
          this.$refs.systemMenu.updateActiveName();
        })
      },
    },
    mounted: function () {
      this.$nextTick(function () {

      })
    },
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home-page {
    height: 100%;
  }

  .text-gradient {
    display: inline-block;
    color: #fff;
    font-size: 26px;
    font-weight: bold;
    opacity: 1;
    font-family: '微软雅黑';
    background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgb(255, 255, 255)), to(rgb(105, 121, 168)));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .system-title {
    /*position: absolute;*/
    width: 100%;
    height: 46px;
    z-index: 10000;
    color: #ffffff;
  }

  .system-title-menu {
    height: 46px;
    line-height: 46px;
    /*background: rgba(4, 38, 100, 0.2)*/
  }

  .content {
    /*position: relative;*/
    /*min-height: 100%;*/
    height: calc(100% - 46px);
    padding-top: 0px;
  }

  .header-logo {
    width: 300px;
    height: 36px;
    float: left;
    position: relative;
    left: 10px;
    color: #ffffff;
    text-align: left;
  }
</style>
