import Vue from 'vue'
import Router from 'vue-router'

const HotMap = () => import("pages/hotMap/HotMap")

Vue.use(Router)

let routes = [{
    path: '/',
    redirect: '/hotMap',
  },
  {
    path: '/hotMap',
    name: 'HotMap',
    component: HotMap
  }
];

export default new Router({
  routes
})
