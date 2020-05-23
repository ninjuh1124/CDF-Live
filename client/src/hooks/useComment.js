import { useState, useContext } from 'react';

import { FeedContext } from '../containers/FeedContainer';
import { RedditContext } from '../containers/HeadingContainer';

const useComment = comment => {
	/** CONTEXTS **/
	const feed = useContext(FeedContext);
	const reddit = useContext(RedditContext);

	/** BUTTON STATES **/
	const [showSource, toggleSource] = useState(false);
	const [showEditor, toggleEditor] = useState();

	const [error, setError] = useState(null);

	return {
		/** SAVE HANDLERS **/
		saved: feed.saved.icludes(comment._id),
		save: () => { feed.saveDispatch({ /** TODO **/ }) },

		/** HIDE HANDLERS **/
		hidden: feed.hidden.includes(comment._id),
		hide: () => { feed.hideDispatch({ /** TODO **/ }) },

		/** UPVOTE HANDLERS **/
		upvoted: feed.upvoted.includes(comment._id),
		upvote: () => { feed.upvoteDispatch({ /** TODO **/ }) },
		
		/** FEED ACTION HANDLERS **/
		edit: body => { feed.historyDispatch({ type: 'edit', _id, body }) },
		delete: () => { feed.historyDispatch({ type: 'delete', _id }) },

		children: feed.history
			.filter(comment => comment.parentID === comment._id),

		/** MISC **/
		ownPost: reddit.user === comment.author,
		isLoggedIn: !!(reddit.user),
		className: comment.parentID[1] === '3' ? 'parent' : 'reply',
		error, setError
	}
}
