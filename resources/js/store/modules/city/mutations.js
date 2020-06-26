export const ADD_CITY = (state, city) => {          
    state.cityList.push(city);
}

export const DELETE_CITY = (state, index) => {
    state.cityList.splice(index, 1);
}

export const SET_CITIES = (state, cities) => {
    state.cityList = cities;
}

export const SORT_CITIES_BY_NAME = (state) => { 
    const cities = state.cityList;
    
    cities.sort((a, b) => {
	
		let nameA = a.name.toUpperCase(); // ignore upper and lowercase
		let nameB = b.name.toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		// names must be equal
		return 0;
	});

	state.cityList = cities;
}

export const SORT_CITIES_BY_DISTRICT = (state) => { 
    const cities = state.cityList; 

    cities.sort((a, b) => {
      return a.district_id - b.district_id;
    });                            

    state.cityList = cities;
}

export const SET_DIVISIONS = (state, divisions) => {
    state.divisionList = divisions;
}

export const SET_DISTRICTS = (state, districts) => {
    state.districtList = districts;
}

export const SET_DISTRICTS_BY_DIVISION = (state, districts) => {
    state.districtListByDivision = districts;
}

export const SET_UPAZILAS = (state, upazilas) => {
    state.upazilaList = upazilas;
}

export const SET_UPAZILAS_BY_DISTRICT = (state, upazilas) => {
    state.upazilaListByDistrict = upazilas;
}

export const SET_CITIES_BY_DIVISION_OF_ROUTE = (state, cities) => {
    state.availableCityList = cities;
}