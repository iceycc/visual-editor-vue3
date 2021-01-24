import {createApp} from 'vue'
import App from './App.vue'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

// @ts-ignore
createApp(App)
    .use(store)
    .use(ElementPlus)
    .mount('#app')
