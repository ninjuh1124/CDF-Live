import React from 'react';
import CommentAuthor from './CommentAuthor';
import CommentBody from './CommentBody';
import axios from 'axios';

class Comment extends React.Component {
	render() {
	let replies = this.props.history
		.filter(comment => comment.parentID === this.props.id)
		.map(comment => {
			return (
				<Comment
					id={comment._id}
					key={comment.id}
					author={comment.author}
					permalink={comment.permalink}
					body={comment.body}
					history={this.props.history}
				/>
			);
		});
	return (
			<li className="comment list-group-item" id={this.props.id}>
				<CommentAuthor
					author={this.props.author} 
					permalink={this.props.permalink}
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
