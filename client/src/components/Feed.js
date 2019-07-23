import React from 'react';
import CommentContainer from '../containers/CommentContainer';

const Feed = (props) => {
	let comments = props.comments
		.filter(comment => comment.parentID > 't3_000000')
		.map(comment => {
			return (
				<div style={{ marginTop: '5px'}} key={comment.id}>
					<CommentContainer
						id={comment._id}
						key={comment.id}
						author={comment.author}
						body={comment.body}
						permalink={comment.permalink}
						created={comment.created}
						className="parent"
					/>
				</div>
			);
		});

	return (
		<div>
			<ul className="list-group" id="feed">
				{comments.length >= 1
				? comments
				: <p>Something went wrong :(</p>
				}
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
