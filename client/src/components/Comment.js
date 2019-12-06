import React, { useContext } from 'react';

import CommentContainer from '../containers/CommentContainer';
import { FeedContext } from '../containers/FeedContainer';
import { CommentBodyRow,
	CommentAuthorRow,
	CommentButtonsRow } from './CommentRows';

export const CommentContext = React.createContext({});

const Comment = props => {
	const feed = useContext(FeedContext);

	const children = feed.comments
		.filter(comment => !feed.hidden.includes(comment._id))
		.filter(comment => comment.parentID === props._id)
		.map(comment => {
			return <CommentContainer
				_id={comment._id}
				id={comment.id}
				key={comment.id}
				author={comment.author}
				body={comment.body}
				permalink={comment.permalink}
				created={comment.created}
				depth={props.depth + 1}
				className="reply"
			/>
		});
	
	return (
		<CommentContext.Provider value={{...props}}>
			<li
				className={
				`${props.className} comment ${props.ownPost ? 'own-post' : ''}`
				}
				id={props._id}
			>

				<CommentAuthorRow />
				<CommentBodyRow />
				<CommentButtonsRow />

				<div className="arrow">
					<h2 className="arrow-link"><a
						href={props.permalink}
						target="_blank"
						rel="noopener noreferrer"
						title="View comment on reddit"
					><i className="fa fa-angle-right" /></a></h2>
				</div>

				<ul
					className="comment-replies"
					id={`${props._id}-replies`}
				>
					{children}
				</ul>

			</li>
		</CommentContext.Provider>
	);
}

export default Comment;
