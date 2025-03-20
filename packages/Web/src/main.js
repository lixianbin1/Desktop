import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant';
import ElementPlus from 'element-plus'
import router from '@/modules/router'
import pinia from '@/modules/pinia'
import i18 from '@/modules/i18n'
import 'element-plus/dist/index.css'
import 'vant/lib/index.css';
import '@/assets/main.css'
import '@/assets/index.css'

createApp(App)
.use(ElementPlus)
.use(Vant)
.use(router)
.use(pinia)
.use(i18)
.mount('#app')
