import Api from './api';

export default {
	routes() {
		return Api.get('api/routes');
	},

	cities(route) {
		return Api.get(`api/${route}/cities`);
	},

	attach(data, route) {
		return Api.post(`/${route}/cities`, data);
	},

	detach(city, route) {
		return Api.delete(`route-cities/${route}/${city}`);
	},

	store(data) {
		return Api.post('routes', data);
	},

	delete(route) {
		return Api.delete(`routes/${route}`);
	},
	
	routescities() {
		return Api.get('api/route-cities');
	},



}