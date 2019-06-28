import React from 'react';
import {CommentBodyRow,
		CommentAuthorRow,
		CommentButtonsRow} from './CommentRows';

class CommentFrame extends React.Component {
	render() {
		let replies = this.props.history
			.filter(comment => comment.parentID === this.props.id)
			.map(comment => {
				return (
					<div key={comment.id}>
						<CommentFrame
							loggedIn={this.props.loggedIn}
							id={comment._id}
							key={comment.id}
							author={comment.author}
							permalink={comment.permalink}
							body={comment.body}
							history={this.props.history}
							created={comment.created}
							className="reply"
						/>
					</div>
				);
			});
			
		return (
			<li
				className={this.props.className + " comment list-group-item"}
				id={this.props.id}
			>
				<CommentAuthorRow {...this.props} />
				<CommentBodyRow {...this.props} />
				{this.props.loggedIn ? <CommentButtonsRow {...this.props}/> : null}

				<ul 
					className="comment-replies list-group" 
					id={this.props.id+'-replies'}
				>
					{replies}
				</ul>
			</li>
		);
	}
}

export default CommentFrame;
