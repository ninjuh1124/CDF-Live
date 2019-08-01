import React from 'react';

import CommentContainer from '../containers/CommentContainer';
import { CommentBodyRow,
	CommentAuthorRow,
	CommentButtonsRow } from './CommentRows';

const Comment = (props) => {
	let children = props.children.map(comment => {
		return <CommentContainer
			_id={comment._id}
			key={comment.id}
			author={comment.author}
			body={comment.body}
			permalink={comment.permalink}
			created={comment.created}
			className="reply"
		/>
	});
	
	return (
		props.isHidden ||
		<li
			className={props.className + " comment list-group-item"}
			id={props._id}
		>

			<CommentAuthorRow {...props} />
			<CommentBodyRow {...props} />
			{props.isLoggedIn ? <CommentButtonsRow {...props} /> : null}

			<ul
				className="comment-replies list-group"
				id={props._id+'-replies'}
			>
				{children}
			</ul>

		</li>
	);
}

export default Comment;
