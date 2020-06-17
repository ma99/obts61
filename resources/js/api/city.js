import Api from './api';

export default {
	divisions() {
		return Api.get('api/divisions');
	},

	districts() {
		return Api.get('api/districts');
	},

	upazilas() {
		return Api.get('api/upazilas');
	}
}