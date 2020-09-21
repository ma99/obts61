import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import state from "./state";
import * as getters from './getters';
import * as mutations from "./mutations";
import * as actions from "./actions";

import bus from "./modules/bus";
import city from "./modules/city";
import fare from "./modules/fare";
import schedule from "./modules/schedule";
import seatplan from "./modules/seatplan";
import route from "./modules/route";
import stop from "./modules/stop";


export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,

    modules: {
        bus,
        city,
        fare,
        route,
        schedule,
        seatplan,
        stop,
    }    
});