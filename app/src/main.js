import {
    createApp
} from 'vue';
import App from './App.vue';
import router from './router';
import './assets/index.sass';
import fetchHelper from './utils/fetch';

const app = createApp(App);
app.use(router);
app.use(fetchHelper)
app.mount('#app');