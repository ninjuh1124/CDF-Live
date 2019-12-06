import React, { useContext } from 'react';
import { FeedContext } from '../containers/FeedContainer';
import CommentContainer from '../containers/CommentContainer';

const Feed = (props) => {
	const feed = useContext(FeedContext);

	const comments = feed.comments && feed.comments
		.filter(comment => !feed.hidden.includes(comment._id))
		.filter(comment => /^t3_\S+/.test(comment.parentID))
		.map(comment => {
			return (
				<CommentContainer
					_id={comment._id}
					key={comment.id}
					id={comment.id}
					author={comment.author}
					body={comment.body}
					permalink={comment.permalink}
					created={comment.created}
					depth={0}
					className="parent"
				/>
			);
		});

	return (
		<div>
			<ul id="feed">
				{feed.error && <p>Something went wrong: {feed.error}</p>}
				{feed.isLoading && <p>Loading...</p>}
				{comments}
			</ul>
			<a 
				className="link-primary"
				href='javascript:void(0)'
				onClick={props.loadMore}
			>
				load more comments
			</a>
		</div>
	);
}

export default Feed;
