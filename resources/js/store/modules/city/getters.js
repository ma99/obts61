export const districtsByDivision = (state) => (divisionId) => {    
    return state.districtList.filter(district => district.division_id == divisionId);
}

export const districtBy = (state) => (id) => {
    return state.districtListByDivision.find(district => district.id == id);
}

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

export const citiesByDivisionOfDepartureArrival = (state) => (route) => {
    return state.cityList.filter(city => 
    	city.division_id == route.departureCityDivId ||
    		city.division_id == route.arrivalCityDivId
    	);
}

export const availableCitiesCount = (state) => {    
     return state.availableCityList.length;
}