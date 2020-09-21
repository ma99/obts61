import Api from './api';

export default {
	stops() {
		return Api.get('api/stops');
	},

	store(data) {
		return Api.post('stops', data);
	},

	delete(id) {
        return Api.delete(`stops/${id}`);
    },
}