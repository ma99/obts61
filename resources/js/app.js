require('./bootstrap');

window.Vue = require('vue');
import VueRouter from 'vue-router';
Vue.use(VueRouter);


import * as GmapVue from 'gmap-vue'

Vue.use(GmapVue, {
  load: {
    key: 'AIzaSyAohU2OqkaeuRNtW_9M2DQFJtet15Zt64o',    
    //key: 'AIzaSyAjEtJn1bABxzi2_NtiO9-ZCpIRwDKa0eI',    
  },
  installComponents: true
})

import { routes } from './routes';
import { store } from './store/index';


// import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
// Vue.component('overlay-scrollbars', OverlayScrollbarsComponent);

Vue.component('example-component', require('./components/ExampleComponent.vue').default);
Vue.component('seat-display', require('./components/SeatDisplay.vue').default);
Vue.component('seat-layout', require('./components/SeatLayout.vue').default);
Vue.component('modal', require('./components/Modal.vue').default);
Vue.component('show-alert', require('./components/Alert.vue').default);
Vue.component('high-light', require('./components/Highlighter.vue').default);
Vue.component('loader', require('./components/Loader.vue').default);
Vue.component('expand', require('./components/ExpandButton.vue').default);
Vue.component('add-section', require('./components/AddSection.vue').default);
Vue.component('border', require('./components/Border.vue').default);
Vue.component('autocomplete', require('./components/Autocomplete.vue').default);
Vue.component('stops-map', require('./components/stops/StopsMap.vue').default);


const router = new VueRouter({
    //linkActiveClass: 'active',
    mode: 'history',
    base: '/admin/',
    routes
});

const app = new Vue({
    el: '#app',    
    router,
    store
});
