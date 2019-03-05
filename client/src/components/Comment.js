import React from 'react';
import CommentAuthor from './CommentAuthor';
import CommentBody from './CommentBody';

class Comment extends React.Component {
	render() {
	let replies = this.props.history
		.filter(comment => comment.parentID === this.props.id)
		.map(comment => {
			return (
				<div key={comment.id}>
					<Comment
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
				<CommentAuthor
					author={this.props.author} 
					permalink={this.props.permalink}
					created={this.props.created}
				/>
				<CommentBody 
					id={this.props.id} 
					body={this.props.body} 
					permalink={this.props.permalink}
				/>

				<ul 
					className="comment-replies list-group" 
					id={this.props.id+'-replies'}
				>
					{replies}
				</ul>
			</li>
		);
	}
};

export default Comment;
