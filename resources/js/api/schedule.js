import Api from './api';

export default {
	schedules() {
		return Api.get('api/schedules');
	},
	
	store(data) {
		return Api.post('/schedules', data);
	},

	delete(id) {
		return Api.delete(`/schedules/${id}`);
	}

}