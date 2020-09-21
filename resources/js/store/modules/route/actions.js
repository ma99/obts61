import Route from '../../../api/route';

export const addRoute = ({ commit, dispatch }, {data}) => {
    // console.log(data)
    Route.store(data).then(response => {
        commit('ADD_ROUTE', response.data);
        dispatch('setSuccess', 
             {status: true},
            { root: true }
        );
    })
    .catch(error => {
        //console.log(error.response.data.message);
        dispatch('setErrors', 
             error.response.data.errors,
            { root: true }
        );
    });
}

export const deleteRoute = ({ commit, state }, id) => {

    Route.delete(id).then(response => {
    
        let index = state.availableRouteList.findIndex(route => route.id === id);
                    
        commit('DELETE_ROUTE', index);
    })
    .catch(error => {
        //console.log(error.response.data.message);
        dispatch('setErrors', 
             error.response.data.errors,
            { root: true }
        );
    });
}

//export const getRoutes = async ({ commit }) => {
export const getRoutes = ({ commit }) => {
    return Route.routes().then(response => {
        commit('SET_ROUTES', response.data);
        // console.log('complete')

    })
    .catch(error => {
        console.log(error.response.data);
        
    });

    // let response = await Route.routes();
    // commit('SET_ROUTES', response.data);
    // console.log('complete')

}

export const sortRoutesByCityName = ({ commit }) => {
    commit('SORT_ROUTES_BY_CITY_NAME');
}

export const sortRoutesByDistance = ({ commit }) => {
    commit('SORT_ROUTES_BY_DISTANCE');
}

// export const getCitiesFromRoutesBy = ({ commit, dispatch }, data) => {
export const getCitiesFromRoutesBy = ({ commit, dispatch }, id) => {
    
	return Route.cities(id).then(response => {
        commit('SET_CITIES_BY_ROUTE', response.data);
        commit('SORT_CITIES_BY_DISTANCE');
    })
}

export const getRouteCityList = ({ commit, state, rootGetters }) => {
    
    const cities = state.citiesByRoute;
    var tempCitiesId = [];
    var tempCities = [];

    //individual city
    cities.forEach(city => {
        
        if ( !tempCitiesId.includes(city.pivot.first_city_id)) 
            tempCitiesId.push(city.pivot.first_city_id);
        
        if ( !tempCitiesId.includes(city.pivot.second_city_id)) 
            tempCitiesId.push(city.pivot.second_city_id);

    })

    // city with id & name
    tempCitiesId.forEach(id => {
        let city = rootGetters['city/getCityById'](id)
          tempCities.push({
              id: id,
              name: city.name,
          });
    })

    // sorting by name
    tempCities.sort((a, b) => {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
        return -1;
        }
        if (nameA > nameB) {
        return 1;
        }
        // names must be equal
        return 0;
    })

    commit('SET_ROUTE_CITY_LIST', tempCities);
}

export const addRouteCity = ({ commit, dispatch }, {data, id}) => {

        Route.attach(data, id).then(response => {
            
            commit('SET_CITIES_BY_ROUTE', response.data);
            commit('SORT_CITIES_BY_DISTANCE');
            dispatch('setSuccess', 
                {status: true},
                { root: true }
            );
    
        })
        .catch(error => {
            //console.log(error.response.data.message);
            dispatch('setErrors', 
                 error.response.data.errors,
                { root: true }
            );
        });
    }

    export const deleteCityFromRoute = ({ commit }, {city, route}) => {

        Route.detach(city, route).then(response => {
          
            commit('SET_CITIES_BY_ROUTE', response.data);
            commit('SORT_CITIES_BY_DISTANCE');
    
        })
    }

    export const emptyCitiesByRoute = ({ commit }) => { 
        commit('EMPTY_CITIES_BY_ROUTE');
    }

    export const getRoutesCities = ({ commit, dispatch }) => { 
        return Route.routescities().then(response => {

        commit('SET_ROUTES_CITIES', response.data);
        //commit('SORT_ROUTES_BY_ID');
        dispatch('getCityRouteList', response.data);
        });
    }

    export const getCityRouteList = ({ commit, rootGetters }, cities) => { 
        //individual city
        var tempCitiesId = []  ;
        var routes = []  ;
        cities.forEach(city => {
            
            if ( !tempCitiesId.includes(city.route_id) ) 
                tempCitiesId.push(city.route_id);
            
        })
        // console.log(tempCitiesId)
        tempCitiesId.forEach(id => {
                let route = rootGetters['route/getRouteBy'](id)
                if (route == null) return;

                routes.push({
                    id: route.id,
                    name: `${route.first_city} - ${route.second_city}`,
                });
        })        
        commit('SET_CITY_ROUTE_LIST', routes);
    }

    export const getCitiesByRoute = ({ commit, state }, id) => { 

        const cities = state.availableRoutesCities;
        let tempCities = [];

        cities.forEach(city => {
            if (city.route_id == id ) 
                tempCities.push(city);

        })
        tempCities.sort((a, b) => {
            return a.distance - b.distance;
        });    

        commit('SET_CITIES_BY_ROUTE', tempCities);


    }