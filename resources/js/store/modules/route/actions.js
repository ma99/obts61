import Route from '../../../api/route';

export const getRoutes = ({ commit }) => {
    Route.routes().then(response => {
        commit('SET_ROUTES', response.data);
        //commit('SORT_ROUTES_BY_ID');
    });
}

export const getCitiesFromRoutesBy = ({ commit }, id) => {
	Route.cities(id).then(response => {
        commit('SET_CITIES_BY_ROUTE', response.data);
        commit('SORT_CITIES_BY_DISTANCE_FROM_DEPERTAURE_CITY');
    })
}

export const addCity = ({ commit }, {city, distance, id}) => {

        const data = {
            city: city.id,
            distance: distance
        }

        Route.attach(data, id).then(response => {
            // const data = {
            //     bus: response.data,
            //     seats: numberOfSeat
            // }
            //commit('ADD_BUS', data);
            commit('SET_CITIES_BY_ROUTE', response.data);
            commit('SORT_CITIES_BY_DISTANCE_FROM_DEPERTAURE_CITY');
    
        })
    }

    export const deleteCityFromRoute = ({ commit }, {city, route}) => {

        Route.detach(city, route).then(response => {
          
            commit('SET_CITIES_BY_ROUTE', response.data);
            commit('SORT_CITIES_BY_DISTANCE_FROM_DEPERTAURE_CITY');
    
        })
    }


    export const emptyCitiesByRoute = ({ commit }) => { 
        commit('EMPTY_CITIES_BY_ROUTE');
    }