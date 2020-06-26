import Api from './api';

export default {
	cities() {
		return Api.get('api/cities');
	},

	divisions() {
		return Api.get('api/divisions');
	},

	districts() {
		return Api.get('api/districts');
	},

	upazilas() {
		return Api.get('api/upazilas');
	},

	store(data) {
        return Api.post('cities', data);
    },

    delete(id) {
        return Api.delete(`cities/${id}`);
    }
}