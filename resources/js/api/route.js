import Api from './api';

export default {
	routes() {
		return Api.get('api/routes');
	},

	cities(id) {
		return Api.get(`api/${id}/cities`);
	},

	attach(data, id) {
		return Api.post(`route-cities/${id}`, data);
	},

	detach(city, route) {
		return Api.delete(`route-cities/${route}/${city}`);
	}

}