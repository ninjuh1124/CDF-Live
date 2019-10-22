import React from 'react';

import CommentContainer from '../containers/CommentContainer';
import { CommentBodyRow,
	CommentAuthorRow,
	CommentButtonsRow } from './CommentRows';

const Comment = (props) => {
	let children = props.children.map(comment => {
		return <CommentContainer
			_id={comment._id}
			id={comment.id}
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
			className={
				props.className + " comment" + 
				(props.ownPost ? ' own-post' : '')
			}
			id={props._id}
		>

			<CommentAuthorRow {...props} />
			<CommentBodyRow {...props} />
			{props.isLoggedIn ? <CommentButtonsRow {...props} /> : null}

			<div className="arrow">
				<h2 className="arrow-link"><a
					href={props.permalink}
					target="_blank"
					rel="noopener noreferrer"
				><i className="fa fa-angle-right" /></a></h2>
			</div>

			<ul
				className="comment-replies"
				id={props._id+'-replies'}
			>
				{children}
			</ul>

		</li>
	);
}

export default Comment;
