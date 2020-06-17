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