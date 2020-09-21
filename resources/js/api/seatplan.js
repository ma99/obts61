import Api from './api';

export default {
	seatplans() {
		return Api.get('api/seatplans');
	},

	store(data) {
		return Api.post('seatplans', data);
	},

	delete(id) {
        return Api.delete(`seatplans/${id}`);
    },
}