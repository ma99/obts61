import City from '../../../api/city';

export const getDivisions = ({ commit }) => {
    City.divisions().then(response => {
        commit('SET_DIVISIONS', response.data);
        //commit('SORT_SEATPLANS_BY_ID');
    });
}

export const getDistricts = ({ commit }) => {
    City.districts().then(response => {
        commit('SET_DISTRICTS', response.data);
        //commit('SET_DISTRICTS_BY_DIVISION', response.data);
        //commit('SORT_SEATPLANS_BY_ID');
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