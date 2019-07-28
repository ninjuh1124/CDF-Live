import { PREPEND_TO_FEED, 
		APPEND_TO_FEED,
		EDIT_FEED,
		DELETE_FROM_FEED,
		UPDATE_THREAD } from '../actionTypes';

const initialState = {
	history: [],
	thread: {
		kind: 'not_loaded',
		_id: '',
		id: '',
		permalink: 'https://reddit.com/r/anime'
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case APPEND_TO_FEED: {
			return {
				...state,
				history: [
					...state.history,
					...action.payload.filter(comment => {
						return !(state.history
							.map(comment => comment._id)
							.includes(comment._id)
						);
					})
				]
			};
		}

		case PREPEND_TO_FEED: {
			return {
				...state,
				history: [
					...action.payload.filter(comment => {
						return !(state.history
							.map(comment => comment._id)
							.includes(comment._id)
						);
					}),
					...state.history
				]
			};
		}

		case EDIT_FEED: {
			return {
				...state,
				history: state.history
					.map(comment => {
						if (comment._id === action.payload._id) {
							return {
								...comment,
								body: action.payload.body
							};
						} else {
							return comment;
						}
					})
			};
		}

		case DELETE_FROM_FEED: {
			return {
				...state,
				history: state.history
					.filter(comment => comment._id !== action.payload)
			};
		}

		case UPDATE_THREAD: {
			return {
				...state,
				thread: action.payload
			};
		}
		
		default: return state;
	}
}
