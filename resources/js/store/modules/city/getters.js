export const divisionListByName = (state) => { 
    const divisions = state.divisionList;
    
    divisions.sort((a, b) => {
    
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

    return divisions;
}

export const districtsByDivision = (state) => (divisionId, list) => {    if (list == 'all') {
            return state.districtList.filter(district => district.division_id == divisionId);
        }
    return state.cityList.filter(district => district.division_id == divisionId);
}

// export const districtBy = (state) => (id) => {
//     return state.districtList.find(district => district.id == id);
// }
export const cityBy = (state) => (id) => {    
    return state.districtList.find(district => district.id == id);
}

export const upazilasByDistrict = (state) => (districtId) => {    
    return state.upazilaList.filter(upazila => upazila.district_id == districtId);
}

export const getCityBy = (state) => (name) => {    
     return state.cityList.find(city =>      
    	city.name == name);      
}

export const getCityById = (state) => (id) => {    
     return state.cityList.find(city =>      
        city.id == id);      
}

export const citiesByDivisionOfFirstAndSecondCity = (state) => (route) => {
    return state.cityList.filter(city => 
    	city.division_id == route.firstCityDivId ||
    		city.division_id == route.secondCityDivId
    	);
}

export const citiesByDivision = (state) => (id) => {
    return state.cityList.filter(city => 
        city.division_id == id
        );
}

export const availableCitiesCount = (state) => {    
     return state.availableCityList.length;
}