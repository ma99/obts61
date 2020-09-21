import Fare from '../../../api/fare';

export const getFares = ({ commit, dispatch }) => {
    return Fare.fares().then(response => {
        commit('SET_FARES', response.data);
        dispatch('setFaresByRoute');
    })
    .catch(error => {
        console.log(error.response.data);
    });    
}

export const addFare = ({ commit, dispatch }, data) => {
   Fare.store(data).then(response => {
        // console.log('afA=', response.data)

        commit('ADD_FARE', response.data);
        dispatch('setFaresByRoute');
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

export const setFaresByRoute = ({ commit, state, rootGetters }) => {

	const availableFares = state.availableFareList;
    let faresByRoute = [];

	availableFares.forEach(fare => {
		
		let cityRoute = rootGetters['route/cityRouteBy'](fare.city_route_id);

		// console.log(`cri=${fare.city_route_id}`,cityRoute);

		if (cityRoute == null) return;
		
			let route = rootGetters['route/getRouteBy'](cityRoute.route_id);

			// console.log(`rI=${cityRoute.route_id}`, route);

			let firstCity = rootGetters['city/getCityById'](cityRoute.first_city_id);
            let secondCity = rootGetters['city/getCityById'](cityRoute.second_city_id);

			if (route == null || firstCity == null || secondCity == null) return;

			faresByRoute.push({
                id: fare.id,
                city_route_id: fare.city_route_id,
                route_id: route.id,
				route: `${route.first_city} - ${route.second_city}`,
				city: `${firstCity.name} - ${secondCity.name}`,
				distance: cityRoute.distance,
				details: fare.details,
				updated_at: fare.updated_at
			});
	})
	
    faresByRoute.sort((a, b) => {

        let nameA = a.route.toUpperCase(); // ignore upper and lowercase
        let nameB = b.route.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // names must be equal
        return 0;
    })
	commit('SET_FARES_BY_ROUTE', faresByRoute);
}

export const deleteFare = ({ commit, dispatch,  state }, id) => {

       return Fare.delete(id).then(response => {
        
            let index = state.availableFareList.findIndex(fare => fare.id === id);
                        
            commit('DELETE_FARE', index);
            dispatch('setFaresByRoute');
        })
        .catch(error => {
            console.log(error.response.data);
        });
    }

export const updateFare = ({ commit }, fare ) => {
        // console.log('Fare=', fare);
        const data = {
            city_route_id: fare.city.id,
            details: fare.details
        }
        
        return Fare.update(data, fare.id).then(response => {            
            
            fare.updated_at = response.data;
            
            commit('UPDATE_FARE', fare);
        })
        .catch(error => {
            console.log(error.response.data);
        });
}