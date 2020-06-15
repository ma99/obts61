import Seatplan from '../../../api/seatplan';

export const getSeatPlans = ({ commit }) => {
    Seatplan.seatplans().then(response => {
        commit('SET_SEATPLANS', response.data);
        commit('SORT_SEATPLANS_BY_ID');
    });
}