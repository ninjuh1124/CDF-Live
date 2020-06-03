import {
	useState,
	useEffect,
	useRef,
	useReducer } from 'react';

import {
	historyReducer,
	upvoteReducer,
	hideReducer,
	saveReducer } from './reducers/feedReducers';

import { loadMore as lm, getHistory as gh } from '../utils/appAPI';

/** HOOKS **/
const useFeed = () => {
	/** FEED ACTIONS **/
	const [history, historyDispatch] = useReducer(historyReducer, []);
	const [upvoted, upvoteDispatch] = useReducer(
		upvoteReducer, 
		JSON.parse(localStorage.getItem('upvoted')) ? JSON.parse(localStorage.getItem('upvoted')) : []
	);
	const [hidden, hideDispatch] = useReducer(
		hideReducer, 
		JSON.parse(localStorage.getItem('hidden')) ? JSON.parse(localStorage.getItem('hidden')) : []
	);
	const [saved, saveDispatch] = useReducer(
		saveReducer, 
		JSON.parse(localStorage.getItem('saved')) ? JSON.parse(localStorage.getItem('saved')) : []);

	/** API STATE **/
	const timeoutId = useRef(0);
	const emptyCalls = useRef(0);
	const [isLoading, setLoading] = useState(false);
	const newestComment = useRef('');

	/** ERROR **/
	const [error, setError] = useState(null);

	/** (RE)LOAD HISTORY **/
	const getHistory = () => {
		setLoading(true);
		gh(newestComment.current)
			.then(comments => {	// filter comments
				return comments.filter(comment => {
					return !history
						.map(c => c._id)
						.includes(comment._id);
				});
			})
			.then(comments => {
				if (comments.length > 0) {
					historyDispatch({
						type: 'prepend',
						comments
					});
					emptyCalls.current = 1;
				} else {
					emptyCalls.current++;
				}
				newestComment.current = comments.length > 0 ? comments[0]._id : '';
				setError(null);
			})
			.catch(err => {
				console.log(err);
				setError(err);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	/** LOAD OLDER HISTORY **/
	const loadMore = () => {
		setLoading(true);
		const parents = history
			.filter(comment => /^t3_\S+$/.test(comment.parentID))
		lm(parents[parents.length - 1]._id)
			.then(comments => {
				if (comments.length > 0) {
					emptyCalls.current = 1;
					historyDispatch({
						type: 'append', comments
					});
				}
				setError(null);
			})
			.catch(err => {
				console.log(err);
				setError(err);
				setLoading(false);
			})
			.finally(() => {
				setLoading(false);
			});
	}

	/** AUTOREFRESH HISTORY ON DECAYING TIMER **/
	useEffect(() => {
		clearTimeout(timeoutId.current);
		timeoutId.current = (setTimeout(
			getHistory,
			emptyCalls.current < 24 ? emptyCalls.current * 5000 : 24*5000
		))
	}, [emptyCalls.current]);

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

export default useFeed;
