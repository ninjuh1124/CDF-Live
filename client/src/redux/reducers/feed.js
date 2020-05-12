import { PREPEND_TO_FEED, 
		APPEND_TO_FEED,
		EDIT_FEED,
		DELETE_FROM_FEED,
		UPVOTE,
		HIDE,
		SAVE,
		UPDATE_THREAD } from '../actionTypes';

const initialState = {
	history: [],
	thread: {
		kind: 'not_loaded',
		_id: '',
		id: '',
		permalink: 'https://reddit.com/r/anime'
	},
	upvoted: localStorage.getItem('upvoted')
		? JSON.parse(localStorage.getItem('upvoted'))
		: [],
	hidden: localStorage.getItem('hidden')
		? JSON.parse(localStorage.getItem('hidden'))
		: [],
	saved: localStorage.getItem('saved')
		? JSON.parse(localStorage.getItem('saved'))
		: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case APPEND_TO_FEED: {
			return {
				...state,
				history: state.history.concat(
					action.payload.filter(comment => !(state.history
						.map(c => c._id)
						.includes(comment._id)
					))
				)
			};
		}

		case PREPEND_TO_FEED: {
			return {
				...state,
				history: action.payload
					.filter(comment => !(state.history
						.map(c=>c._id)
						.includes(comment._id)
					))
					.concat(state.history)
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

		case UPVOTE: {
			localStorage.setItem('upvoted', JSON.stringify(
				state.upvoted.includes(action.payload) ?
					state.upvoted.filter(_id => _id !== action.payload) :
					[...state.upvoted, action.payload]
			));
			return {
				...state,
				upvoted: state.upvoted.includes(action.payload) ?
					state.upvoted.filter(_id => _id !== action.payload) :
					[...state.upvoted, action.payload]
			};
		}

		case HIDE: {
			localStorage.setItem('hidden', JSON.stringify(
				state.hidden.includes(action.payload) ?
					state.hidden.filter(_id => _id !== action.payload) :
					[...state.hidden, action.payload]
			));
			return {
				...state,
				hidden: state.hidden.includes(action.payload) ?
					state.hidden.filter(_id => _id !== action.payload) :
					[...state.hidden, action.payload]
			};
		}

		case SAVE: {
			localStorage.setItem('saved', JSON.stringify(
				state.saved.includes(action.payload) ?
					state.saved.filter(_id => _id !== action.payload) :
					[...state.saved, action.payload]
			));
			return {
				...state,
				saved: state.saved.includes(action.payload) ?
					state.saved.filter(_id => _id !== action.payload) :
					[...state.saved, action.payload]
			}
		}
		
		default: return state;
	}
}
