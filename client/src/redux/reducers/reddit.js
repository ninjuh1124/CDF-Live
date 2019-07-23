import { SET_ACCESS_TOKEN,
		SET_REFRESH_TOKEN,
		SET_USER } from '../actionTypes';

const initialState = {
	refreshToken: localStorage.getItem('refreshToken')
		? localStorage.getItem('refreshToken')
		: null,
	accessToken: '',
	isLoggedIn: false,
	loggedInAs: ''
}

export default const (state = initialState, action) {
	switch (action.type) {
		case SET_ACCESS_TOKEN: {
			return {
				...state,
				accessToken: action.payload.accessToken
			}
		}

		case SET_REFRESH_TOKEN: {
			return {
				...state,
				refreshToken: action.payload.refreshToken
			}
		}

		case SET_USER: {
			return {
				...state,
				isLoggedIn: true,
				loggedInAs: action.payload
			}
		}

		default: return state;
	}
}
