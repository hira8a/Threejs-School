import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import menuItem from '@/components/menuItem/index.vue';
import { createPinia } from 'pinia';
import piniaPluginPersist from 'pinia-plugin-persist';

const store = createPinia();
store.use(piniaPluginPersist);

const app = createApp(App);

app.component('menuItem',menuItem);

app
    .use(ElementPlus)
    .use(router)
    .use(store)
    .mount('#app')
    
