import {
	createContext,
	useState,
	useContext,
	useReducer } from 'react';

/** TODO import reducer logic from redux **/
/** REDUCERS **/
const feedReducer = (state, action) => {
	switch (action.type) {
		case 'prepend': break;
		case 'append': break;
		case 'update': break;
		case 'edit': break;
		case 'delete': break;
		case 'hide': break;
		case 'save': break;
		case 'upvote': break;
		default: break;
	}
}

const upvoteReducer = (state, action) => {
	switch (action.type) {
		case 'upvote': break;
		case 'unvote': break;
		case 'downvote': break;
		default: break;
	}
}

const hideReducer = (state, action) => {
	switch (action.type) {
		case 'hide': break;
		case 'unhide': break;
		default: break;
	}
}

const saveReducer = (state, action) => {
	switch (action.type) {
		case 'save': break;
		case 'unsave': break;
		default: break;
}

/** HOOKS **/
const useFeed = () => {
	/** FEED ACTIONS **/
	const [history, historyDispatch] = useReducer(feedReducer, []);
	const [upvoted, upvoteDispatch] = useReducer(
		upvoteReducer, JSON.parse(localStorage.getItem('upvoted'))
	);
	const [hidden, hideDispatch] = useReducer(
		hideReducer, JSON.parse(localStorage.getItem('hidden'))
	);
	const [saved, saveDispatch] = useReducer(
		saveReducer, JSON.parse(localStorage.getItem('saved'))
	);

	/** API STATE **/
	const [timeoutId, setTimeoutId] = useState(0);
	const [emptyCalls, setEmptyCalls] = useState(0);
	const [isLoading, setLoading] = useState(false);
	const [newestComment, setNewestComment] = useState(null);

	/** ERROR **/
	const [error, setError] = useState(null);

	/** (RE)LOAD HISTORY **/
	const getHistory = () => {
		setLoading(true);
		app.getHistory(newestComment)
			.then(comments => {
				if (comments.length > 0) {
					clearTimeout(timeoutId);
					setEmptyCalls(1);
					historyDispatch({
						type: 'prepend',
						comments
					});
					setLoading(false);
				}
			})
			.catch(error => {
				setError(error);
				setLoading(false);
			});
	}

	/** LOAD OLDER HISTORY **/
	const loadMore = () => {
		setLoading(true);
		const parents = history
			.map(comment => comment.parentID)
			.filter(id => /^t3_\S+$/.test(id))
		app.loadMore(parents[parents.length - 1])
			.then(comments => {
				if (comments.length > 0) {
					clearTimeout(timeoutId);
					setEmptyCalls(1);
					historyDispatch({
						type: 'append', comments
					});
				}
			})
			.catch(error => {
				setError(error);
				setLoading(false);
			});
	}

	/** AUTOREFRESH HISTORY ON DECAYING TIMER **/
	useEffect(() => {
		setTimeoutId(setTimeout(
			getHistory,
			emptyCalls < 24 ? emptyCalls * 5000 : 24*5000
		))
	}, [emptyCalls]);

	/** RETURN HOOKS **/
	return {
		history, isLoading,
		prepend: comments => {
			dispatch({ type: prepend, comments })
		},
		loadMore,
		upvoted, upvoteDispatch,
		hidden, hideDispatch,
		saved, saveDispatch,
		error
	}
}
