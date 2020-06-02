import React, { useContext } from 'react';
import { FeedContext } from '../context'
import Comment from '../components/Comment';

const Feed = props => {
	const feed = useContext(FeedContext);

	const comments = feed.history.length > 0 ? feed.history
		.filter(comment => !feed.hidden.includes(comment._id))
		.filter(comment => /^t3_\S+/.test(comment.parentID))
		.map(comment => {
			return (
				<Comment
					_id={comment._id}
					key={comment.id}
					id={comment.id}
					author={comment.author}
					body={comment.body}
					permalink={comment.permalink}
					created={comment.created}
					depth={0}
				/>
			);
		}) : null;

	return (
		<div>
			<ul id="feed">
				{feed.error && <p>Something went wrong: {`${feed.error}`}</p>}
				{feed.isLoading && feed.history.length === 0 &&
					<p>Loading...</p>
				}
				{comments}
			</ul>
			<a 
				className="link-primary"
				href='javascript:void(0)'
				onClick={feed.loadMore}
			>
				load more comments
			</a>
		</div>
	);
}

export default Feed;
