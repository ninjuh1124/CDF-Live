import { useState, useContext } from 'react';

import useEditor from './useEditor';

import { FeedContext, RedditContext } from '../context';

const useComment = comment => {
	/** CONTEXTS **/
	const feed = useContext(FeedContext);
	const reddit = useContext(RedditContext);

	/** TEXT AREAS **/
	const editor = useEditor({ _id: comment._id });
	const [showSource, setShowSource] = useState(false);

	const [error, setError] = useState(null);

	return {
		/** COMMENT DATA **/
		...comment,

		/** TEXT AREA HANDLERS **/
		editor, showSource, setShowSource,

		/** REDDIT ACCESS **/
		accessToken: reddit.accessToken,
		user: reddit.user,

		/** FEED ACTION HANDLERS **/
		/** SAVE HANDLERS **/
		saved: feed.saved.icludes(comment._id),
		save: () => { 
			try {
				feed.saveDispatch({ 
					_id: comment._id, 
					type: 'save', 
					accessToken: reddit.accessToken 
				});
				setError(null);
			} catch (err) {
				setError(err)
			}
		},
		unsave: () => {
			try {
				feed.saveDispatch({ 
					_id: comment._id, 
					type: 'unsave', 
					accessToken: reddit.accessToken 
				});
				setError(null);
			} catch (err) {
				setError(err)
			}
		},

		/** HIDE HANDLERS **/
		hidden: feed.hidden.includes(comment._id),
		hide: () => { 
			try {
				feed.hideDispatch({ 
					_id: comment._id, 
					type: 'hide', 
					accessToken: reddit.accessToken 
				});
				setError(null);
			} catch (err) {
				setError(err)
			}
		},
		unhide: () => {
			try {
				feed.hideDispatch({ 
					_id: comment._id, 
					type: 'unhide', 
					accessToken: reddit.accessToken 
				});
				setError(null);
			} catch (err) {
				setError(err)
			}
		},

		/** UPVOTE HANDLERS **/
		upvoted: feed.upvoted.includes(comment._id),
		upvote: () => { 
			try {
				feed.upvoteDispatch({ 
					_id: comment._id,
					type: 'upvote',
					accessToken: reddit.accessToken
				});
			} catch (err) {
				setError(err);
			}
		},
		unvote: () => { 
			try {
				feed.upvoteDispatch({ 
					_id: comment._id,
					type: 'unvote',
					accessToken: reddit.accessToken
				});
			} catch (err) {
				setError(err);
			}
		},

		/** DELETE HANDLER **/
		delete: () => { 
			try {
				feed.historyDispatch({ 
					type: 'delete', _id: comment._id 
				}); 
			} catch (err) {
				setError(err);
			}
		},

		children: feed.history
			.filter(comment => comment.parentID === comment._id),

		/** MISC **/
		ownPost: reddit.user === comment.author,
		className: comment.parentID[1] === '3' ? 'parent' : 'reply',
		error, setError
	}
}

export default useComment;
