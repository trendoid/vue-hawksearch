import Vue from 'vue';
window.Vue = Vue;

Vue.config.devtools = true;

import VueResource from 'vue-resource';
Vue.use(VueResource);

import HawkSearchVue from "./HawkSearchVue";
window.HawkSearchVue = HawkSearchVue;

import 'styles/app.scss';

export * from "./widgets";
export * from './components';
export { default as HawkSearchStore } from './store';
export { default as tConfig } from './i18n';
export default HawkSearchVue;
