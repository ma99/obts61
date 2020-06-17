import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import state from "./state";
import * as getters from './getters';
import * as mutations from "./mutations";
import * as actions from "./actions";

import bus from "./modules/bus";
import city from "./modules/city";
import seatplan from "./modules/seatplan";


export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,

    modules: {
        bus,
        city,
        seatplan
    }    
});