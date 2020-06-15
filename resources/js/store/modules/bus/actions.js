import Bus from '../../../api/bus';


    //axios.get('/api/types').then(response => {
    export const getBusTypes = ({ commit }) => {
        Bus.types().then(response => {
            commit('SET_BUS_TYPES', response.data);
        })
    }

    export const getBuses = ({ commit }) => {            
        Bus.buses().then(response => {
            commit('SET_BUSES', response.data);
            commit('SORT_BUSES_BY_ID');
        })
    }

    export const sortByBusId = ({ commit }) => {
        commit('SORT_BUSES_BY_ID');
    }

    export const sortByRegNumber = ({ commit }) => {
        commit('SORT_BUSES_BY_REG_NUMBER');
    }

    export const addBus = ({ commit }, { bus, numberOfSeat }) => {

        const data = {
            seat_plan_id: bus.seatPlanId,
            reg_no: bus.regNumber,
            number_plate: bus.numberPlate,
            type_id: bus.typeId,                
            description: bus.description
        }

        Bus.store(data).then(response => {
            const data = {
                bus: response.data,
                seats: numberOfSeat
            }
            commit('ADD_BUS', data);
        })
    }

    export const updateBus = ({ commit }, { busInfo, busToEdit }) => {
        
        const data = {
            seat_plan_id: busInfo.seatPlanId,
            reg_no: busInfo.regNumber,
            number_plate: busInfo.numberPlate,
            type_id: busInfo.typeId,                
            description: busInfo.description
        }
        
        Bus.update(data, busToEdit.id).then(response => {            
            const data = {
                bus: busInfo,
                index: busToEdit.index,
                id: busToEdit.id
            }
            commit('UPDATE_BUS', data);
        })
    }

    export const deleteBus = ({ commit, state }, id) => {

        Bus.delete(id).then(response => {
        
            let index = state.availableBusList.findIndex(bus => bus.bus.id === id);
                        
            commit('DELETE_BUS', index);
        })
    }