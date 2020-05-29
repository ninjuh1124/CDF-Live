/**
 * Reducers assume type-checking, etc. is done before reducers are called
 **/

export const historyReducer = (state, action) => {
	switch (action.type) {
		case 'prepend': 
			return [...action.comments, ...state];
		case 'append': 
			return [...state, ...action.comments];
		case 'edit': break;
		case 'delete': 
			return state.filter(comment => comment._id !== action._id);
		default: 
			throw new Error('Invalid action.type in historyReducer');
	}
}

export const upvoteReducer = (state, action) => {
	switch (action.type) {
		case 'upvote': 
			return [...state, action._id];
		case 'unvote': 
			return state.filter(_id => _id !== action._id);
		default: 
			throw new Error('Invalid action.type in upvoteReducer');
	}
}

export const hideReducer = (state, action) => {
	switch (action.type) {
		case 'hide': 
			return [...state, action._id];
		case 'unhide': 
			return state.filter(_id => _id !== action._id);
		default: 
			throw new Error('Invalid action.type in hideReducer');
	}
}

export const saveReducer = (state, action) => {
	switch (action.type) {
		case 'save': 
			return [...state, action._id];
		case 'unsave': 
			return state.filter(_id => _id !== action._id);
		default: 
			throw new Error('Invalid action.type in saveReducer');
	}
}
