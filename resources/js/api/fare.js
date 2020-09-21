import Api from './api';

export default {
	fares() {
		return Api.get('api/fares');
	},

	store(data) {
		return Api.post('fares', data);
	},

	delete(id) {
        return Api.delete(`fares/${id}`);
    },

    update(data, id) {
        return Api.patch(`fares/${id}`, data);
    },
}