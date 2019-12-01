import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'
import router from './router/index'
import './plugins/index'
import App from './App.vue'
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn'
import email from 'emailjs'
dayjs.locale('zh-cn')
Vue.use(ElementUI)
Vue.config.productionTip = false

async function start() {
  await store.dispatch('initStore')
  const vm = new Vue({
    render: h => h(App),
    router: router,
    store: store
  }).$mount('#app')
}

start().then(() => {
  console.log('start')
})

