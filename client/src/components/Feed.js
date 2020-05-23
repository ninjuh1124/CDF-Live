import React, { useContext } from 'react';
import { FeedContext } from '../containers/FeedContainer';
import Comment from '../components/CommentContainer';

const Feed = props => {
	const feed = useContext(FeedContext);

	const comments = feed.comments && feed.comments
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
		});

	return (
		<div>
			<ul id="feed">
				{feed.error && <p>Something went wrong: {feed.error}</p>}
				{feed.isLoading && feed.comments.length === 0 &&
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
