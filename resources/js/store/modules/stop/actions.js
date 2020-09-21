import Stop from '../../../api/stop';

export const getStops = ({ commit }) => {
    return Stop.stops().then(response => {
        commit('SET_STOPS', response.data);
        //commit('SORT_SEATPLANS_BY_ID');
    });
}

export const addStop = ({ commit, dispatch }, data) => {
    // console.log('dt=', data)
    // data.stop_list.forEach(element => console.log(element));
    //return;
   return Stop.store(data).then(response => {
        
        //console.log('stops=', data.stop_list)

        commit('ADD_STOP', response.data.stop_list);
        //commit('ADD_STOP', response.data);
        //dispatch('setFaresByRoute');
        dispatch('setSuccess', 
             {status: true},
            { root: true }
        );
    })
    .catch(error => {
        //console.log(error.response.data);
        dispatch('setErrors', 
             error.response.data.errors,
            { root: true }
        );
    });
}

export const deleteStop = ({ commit, state }, stop) => {

       return Stop.delete(id).then(response => {
        
            let index = state.availableStopList.findIndex(stop => stop.id === id);
                        
            commit('DELETE_STOP', index);
            // dispatch('setFaresByRoute');
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }

export const updateSeatplan = ({ commit }, seatplan ) => {
        // console.log('Fare=', fare);
        const data = {
            city_route_id: fare.city.id,
            details: fare.details
        }
        
        return Seatplan.update(data, fare.id).then(response => {            
            
            fare.updated_at = response.data;
            
            commit('UPDATE_FARE', fare);
        })
        .catch(error => {
            console.log(error.response.data);
        });
}