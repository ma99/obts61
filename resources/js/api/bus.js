import api from './api';

export default {
	types() {
		return api.get('api/types');
	},

	buses() {
		return api.get('api/buses');
	},

	seatplans() {
		return api.get('api/seatplans');
	},

	store(data) {
        return api.post('buses', data);
    },

    update(data, id) {
        return api.patch(`buses/${id}`, data);
    },

    delete(id) {
        return api.delete(`buses/${id}`);
    },
}