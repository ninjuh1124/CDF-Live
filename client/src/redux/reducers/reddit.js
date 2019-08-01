import { SET_ACCESS_TOKEN,
		SET_REFRESH_TOKEN,
		SET_USER,
		LOGOUT } from '../actionTypes';

const initialState = {
	refreshToken: localStorage.getItem('refreshToken')
		? localStorage.getItem('refreshToken')
		: '',
	accessToken: '',
	isLoggedIn: !!(localStorage.getItem('refreshToken')),
	loggedInAs: ''
}

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_ACCESS_TOKEN: {
			return {
				...state,
				accessToken: action.payload.accessToken
			};
		}

		case SET_REFRESH_TOKEN: {
			return {
				...state,
				refreshToken: action.payload.refreshToken
			};
		}

		case SET_USER: {
			return {
				...state,
				isLoggedIn: true,
				loggedInAs: action.payload
			};
		}

		case LOGOUT: {
			localStorage.removeItem('refreshToken');
			return {
				...state,
				accessToken: '',
				refreshToken: '',
				isLoggedIn: false,
				loggedInAs: ''
			};
		}

		default: return state;
	}
}
