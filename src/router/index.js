import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'home',
    component: resolve => require(['../App.vue'], resolve),
    children: [
      {
        path: 'home',
        name: 'home',
        redirect: {name: 'aicGisMap'},
        component: resolve => require(['../pages/Home.vue'], resolve),
        meta: { requiresAuth: true ,keepAlive:false},
        children: [
          {
            path: 'aicGisMap',
            name: 'aicGisMap',
            component: resolve => require(['../pages/AicGisMap.vue'], resolve),
            //meta: { requiresAuth: true }
          },
          {
            name: 'amap',
            path: 'amap',
            component: resolve => require(['../pages/Amap.vue'], resolve),
            //meta: { requiresAuth: true }
          },
          {
            name: 'bmap',
            path: 'bmap',
            component: resolve => require(['../pages/Bmap.vue'], resolve),
            //meta: { requiresAuth: true }
          },
          {
            name: 'echarts',
            path: 'echarts',
            component: resolve => require(['../pages/Echarts.vue'], resolve),
            //meta: { requiresAuth: true }
          },
          {
            name: 'scatter',
            path: 'scatter',
            component: resolve => require(['../pages/ol_echarts/Scatter.vue'], resolve),
            //meta: { requiresAuth: true }
          },
          {
            name: 'migration',
            path: 'migration',
            component: resolve => require(['../pages/ol_echarts/Migration.vue'], resolve),
            //meta: { requiresAuth: true }
          },
          {
            name: 'pie',
            path: 'pie',
            component: resolve => require(['../pages/ol_echarts/Pie.vue'], resolve),
            //meta: { requiresAuth: true }
          },
          {
            name: 'lineBus',
            path: 'lineBus',
            component: resolve => require(['../pages/ol_echarts/LineBus.vue'], resolve),
            //meta: { requiresAuth: true }
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  /*  mode: 'history',*/
  routes
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;



