import Api from './api';

export default {
	seatplans() {
		return Api.get('api/seatplans');
	}
}