export const districtsByDivision = (state) => (divisionId) => {    
    return state.districtList.filter(district => district.division_id == divisionId);
}

export const districtBy = (state) => (id) => {    
    return state.districtListByDivision.find(district => district.id == id);
}

export const upazilasByDistrict = (state) => (districtId) => {    
    return state.upazilaList.filter(upazila => upazila.district_id == districtId);
}