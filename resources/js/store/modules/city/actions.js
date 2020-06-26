import City from '../../../api/city';

export const getDivisions = ({ commit }) => {
    City.divisions().then(response => {
        commit('SET_DIVISIONS', response.data);
    });
}

export const getDistricts = ({ commit }) => {
    City.districts().then(response => {
        commit('SET_DISTRICTS', response.data);      
    });
}

export const getDistrictsByDivision = ({ commit, getters }, id) => {  
	let districts = getters.districtsByDivision(id);  
    commit('SET_DISTRICTS_BY_DIVISION', districts);    
}

export const getUpazilas = ({ commit }) => {
    City.upazilas().then(response => {
        commit('SET_UPAZILAS', response.data);
        //commit('SORT_SEATPLANS_BY_ID');
    });
}

export const getUpazilasByDistrict = ({ commit, getters }, id) => {  
	let upazilas = getters.upazilasByDistrict(id);  

    commit('SET_UPAZILAS_BY_DISTRICT', upazilas);    
}

export const getBusAvailableToCities = ({ commit }) => {
    City.cities().then(response => {
        commit('SET_CITIES', response.data);
        commit('SORT_CITIES_BY_NAME');
    });
}

export const sortCitiesByName =  ({ commit }) => { 
    commit('SORT_CITIES_BY_NAME');
}

export const sortCitiesByDistrict  =  ({ commit }) => { 
    commit('SORT_CITIES_BY_DISTRICT');
}

export const addCity = ({ commit }, city) => {

        const data = {
            division_id: city.divisionId,
            district_id: city.districtId,
            name: city.name,                
        }

        City.store(data).then(response => {
            commit('ADD_CITY', response.data);
            //commit('SORT_CITIES_BY_NAME');
        })
    }

    export const deleteCity = ({ commit, state }, id) => {

        City.delete(id).then(response => {
        
            let index = state.cityList.findIndex(city => city.id === id);
                        
            commit('DELETE_CITY', index);
        })
    }

    export const getCitiesByDivisionOfDepartureArrival = ({ commit, getters }, route) => {  
    let cities = getters.citiesByDivisionOfDepartureArrival(route);  

    commit('SET_CITIES_BY_DIVISION_OF_ROUTE', cities);    
}

