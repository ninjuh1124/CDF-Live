import React, { useContext } from 'react';
import { FeedContext } from '../context'
import Comment from '../components/Comment';
import RedditButton from './RedditButton';

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
					parentID={comment.parentID}
					depth={0}
				/>
			);
		}) : null;

	return (
		<div id="feed">
			<ul>
				{feed.error && 
					<p class='error' id='feed-error'>
						Something went wrong: {`${feed.error}`}
					</p>
				}
				{comments}
			</ul>
			
			{feed.isLoading && <p>Loading...</p>}
			<RedditButton 
				disabled={feed.isLoading}
				onClick={feed.loadMore}
			>
				load more comments
			</RedditButton>
		</div>
	);
}

export default Feed;
