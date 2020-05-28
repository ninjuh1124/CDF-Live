import {
	createContext,
	useState,
	useContext,
	useReducer } from 'react';

import {
	historyReducer,
	upvoteReducer,
	hideReducer,
	saveReducer } from './reducers/feedReducers';

/** HOOKS **/
const useFeed = () => {
	/** FEED ACTIONS **/
	const [history, historyDispatch] = useReducer(historyReducer, []);
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

	/** BROWSER SIDE-EFFECTS **/
	useEffect(() => {
		localStorage.setItem('upvoted', JSON.stringify(upvoted));
	}, [upvoted]);

	useEffect(() => {
		localStorage.setItem('hidden', JSON.stringify(hidden));
	}, [hidden]);

	useEffect(() => {
		localStorage.setItem('saved', JSON.stringify(saved));
	}, [saved]);

	/** RETURN HOOKS **/
	return {
		history, historyDispatch,
		isLoading, loadMore,
		upvoted, upvoteDispatch,
		hidden, hideDispatch,
		saved, saveDispatch,
		error, setError
	}
}
