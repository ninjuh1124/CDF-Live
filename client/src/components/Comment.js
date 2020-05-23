import React from 'react';

import CommentContainer from '../containers/CommentContainer';
import { FeedContext } from '../containers/FeedContainer';
import { CommentBodyRow,
	CommentAuthorRow,
	CommentButtonsRow } from './CommentRows';

const Comment = props => {
	const meta = useComment(props);
	
	return (meta.hidden &&
		<li
			className={
			`${meta.className} comment ${meta.ownPost ? 'own-post' : ''}`
			}
			id={props._id}
		>

			<CommentAuthorRow 
				permalink={props.permalink}
				author={props.author}
				created={props.created}
			/>
			<CommentBodyRow 
				body={props.body}
			/>
			<CommentButtonsRow 
				_id={id}
				id={id}
				ownPost={meta.ownPost}
				upvoted={meta.upvoted}
				setError={meta.setError}
				isSaved={meta.saved}
				isHidden={meta.hidden}
				showSource={meta.showSource}
				showEditor={meta.showEditor}
				delete={meta.delete}
				upvote={meta.upvote}
				hide{meta.hide}
				save{meta.save}
				toggleSource={meta.toggleSource}
				toggleEditor={meta.toggleEditor}
			/>

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
				{
					meta.children.map(comment => {
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
					})
				}
			</ul>

		</li>
	);
}

export default Comment;
