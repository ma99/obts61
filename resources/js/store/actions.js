export const setErrors = ({ commit }, errors) => {
    commit('SET_ERRORS', errors);
}

export const resetErrors = ({ commit }, field) => {
    commit('RESET_ERRORS', field);
}

export const setSuccess = ({ commit }, success) => {	
    commit('SET_SUCCESS', success);
}