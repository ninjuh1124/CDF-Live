import React from 'react';

import useComment from '../hooks/useComment';

import { CommentBodyRow,
	CommentAuthorRow,
	CommentButtonsRow } from './CommentRows';

const Comment = props => {
	const meta = useComment({ ...props });
	
	return (meta.hidden &&
		<li
			className={meta.className}
			id={meta._id}
		>

			<CommentAuthorRow 
				comment={meta}
			/>
			<CommentBodyRow 
				comment={meta}
			/>
			<CommentButtonsRow 
				comment={meta}
			/>

			<div className="arrow">
				<h2 className="arrow-link"><a
					href={meta.permalink}
					target="_blank"
					rel="noopener noreferrer"
					title="View comment on reddit"
				><i className="fa fa-angle-right" /></a></h2>
			</div>

			<ul
				className="comment-replies"
				id={`${props._id}-replies`}
			>
				{
					meta.children.map(comment => 
						<Comment
							_id={comment._id}
							id={comment.id}
							key={comment.id}
							body={comment.body}
							author={comment.author}
							permalink={comment.permalink}
							created={comment.created}
							depth={props.depth+1}
						/>
					)
				}
			</ul>

		</li>
	);
}

export default Comment;
