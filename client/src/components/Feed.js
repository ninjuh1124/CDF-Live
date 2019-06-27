import React from 'react';
import CommentFrame from './CommentFrame';

const Feed = (props) => {
	let comments = props.history
		.filter(comment => comment.parentID > 't3_000000')
		.map(comment => {
			return (
				<div style={{ marginTop: '5px'}} key={comment.id}>
					<CommentFrame
						loggedIn={props.loggedIn}
						id={comment._id}
						key={comment.id}
						author={comment.author}
						body={comment.body}
						permalink={comment.permalink}
						created={comment.created}
						history={props.history}
						className="parent"
					/>
				</div>
			);
		});

	return (
		<ul className="list-group" id="feed">
			{comments.length >= 1
			? comments
			: <p>Something went wrong :(</p>
			}
		</ul>
	);
}

export default Feed;
