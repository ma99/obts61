import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import bus from '../api/bus';

export const store = new Vuex.Store({
    state: {
    	availableBusList: [],
        availableSeatPlanList: [],
        types: [],                    //bustypes
    },

    getters: {
        typeBy: (state) => (id) => {
            let type = state.types.find(type => type.id == id);
            
              if(type) {              
                return type.name;
            }
        },
        busBy: (state) => (id) => {
            return state.availableBusList.find(element => element.bus.id == id
            );            
        },
        getIndexOf: (state) => (bus) => {
            return state.availableBusList.indexOf(bus);
        }
    },

    mutations: {
        ADD_BUS(state, data) {          
            state.availableBusList.push({
                bus: data.bus,
                total_seats: data.seats 
            })
        },
        DELETE_BUS(state, index) {
            state.availableBusList.splice(index, 1);
        },

        UPDATE_BUS(state, data) {

            let index = data.index;

            state.availableBusList[index].bus = {
                reg_no: data.bus.regNumber,
                number_plate: data.bus.numberPlate,
                type_id: data.bus.typeId,
                seat_plan_id: data.bus.seatPlanId,
                description: data.bus.description,
            }
        },

        SET_BUS_TYPES(state, types) {
            state.types = types;
        },

        SET_BUSES(state, buses) {
            state.availableBusList = buses;
        },        

        SORT_BUSES_BY_ID(state) {
            const buses = state.availableBusList;

            buses.sort((a, b) => {
                return a.bus.id - b.bus.id
            });

            state.availableBusList = buses;
        },

        SORT_BUSES_BY_REG_NUMBER(state) {
            const buses = state.availableBusList;

            buses.sort((a, b) => {
                let nameA = a.bus.reg_no; 
                let nameB = b.bus.reg_no; 
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }            
                return 0;
            });

            state.availableBusList = buses;
        },

        SET_SEATPLANS(state, seatplans) {
            state.availableSeatPlanList = seatplans;
        },

        SORT_SEATPLANS_BY_ID(state) {
            const seatplans = state.availableSeatPlanList;
            
            seatplans.sort((a, b) => {
                return a.id - b.id;
            });
            
            state.availableSeatPlanList = seatplans;
        },
    },
    
    actions: {
        getBusTypes({ commit }) {
            //axios.get('/api/types').then(response => {
            bus.types().then(response => {
                commit('SET_BUS_TYPES', response.data);
            })
        },

        getBuses({ commit }) {            
            bus.buses().then(response => {
                commit('SET_BUSES', response.data);
                commit('SORT_BUSES_BY_ID');
            })
        },

        getSeatPlans({ commit }) {
            bus.seatplans().then(response => {
                commit('SET_SEATPLANS', response.data);
                commit('SORT_SEATPLANS_BY_ID');
            });
        },

        sortByBusId({ commit}) {
            commit('SORT_BUSES_BY_ID');
        },

        sortByRegNumber({ commit }) {
            commit('SORT_BUSES_BY_REG_NUMBER');
        },

        addBus({ commit }, { busInfo, numberOfSeat }) {

            const data = {
                seat_plan_id: busInfo.seatPlanId,
                reg_no: busInfo.regNumber,
                number_plate: busInfo.numberPlate,
                type_id: busInfo.typeId,                
                description: busInfo.description
            }

            bus.store(data).then(response => {
                const data = {
                    bus: response.data,
                    seats: numberOfSeat
                }
                commit('ADD_BUS', data);
            })
        },

        updateBus({ commit }, { busInfo, busToEdit }) {
            
            const data = {
                seat_plan_id: busInfo.seatPlanId,
                reg_no: busInfo.regNumber,
                number_plate: busInfo.numberPlate,
                type_id: busInfo.typeId,                
                description: busInfo.description
            }
            
            bus.update(data, busToEdit.id).then(response => {
                
                const data = {
                    bus: busInfo,
                    index: busToEdit.index
                }
                commit('UPDATE_BUS', data);
            })
        },

        deleteBus({ commit, state }, id) {

            bus.delete(id).then(response => {
            
                let index = state.availableBusList.findIndex(bus => bus.bus.id === id);
                            
                commit('DELETE_BUS', index);
            })
        },

    },
});