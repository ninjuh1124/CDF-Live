import {
	deletePost,
	savePost,
	unsavePost,
	upvotePost } from '../../utils/redditAPI'

/**
 * Reducers assume type-checking, etc. is done before reducers are called
 **/

export const historyReducer = (state, action) => {
	switch (action.type) {
		case 'prepend': 
			return [...action.comments, ...state];
			break;
		case 'append': 
			return [...state, ...action.comments];
			break;
		case 'edit': break;
		case 'delete': 
			return state.filter(comment => comment._id !== action._id);
			break;
		default: 
			throw new Error('Invalid action.type in historyReducer');
			break;
	}
}

export const upvoteReducer = (state, action) => {
	switch (action.type) {
		case 'upvote': 
			upvotePost({ ...action, dir: 1 });
			return [...state, action._id];
			break;
		case 'unvote': 
			upvotePost({ ...action, dir: 0 });
			return state.filter(_id => _id !== action._id);
			break;
		default: 
			throw new Error('Invalid action.type in upvoteReducer');
			break;
	}
}

export const hideReducer = (state, action) => {
	switch (action.type) {
		case 'hide': 
			return [...state, action._id];
			break;
		case 'unhide': 
			return state.filter(_id => _id !== action._id);
			break;
		default: 
			throw new Error('Invalid action.type in hideReducer');
			break;
	}
}

export const saveReducer = (state, action) => {
	switch (action.type) {
		case 'save': 
			savePost({ ...action });
			return [...state, action._id];
			break;
		case 'unsave': 
			unsavePost({ ...action });
			return state.filter(_id => _id !== action._id);
			break;
		default: 
			throw new Error('Invalid action.type in saveReducer');
			break;
}
