import React from 'react';
import CommentAuthor from './CommentAuthor';
import CommentBody from './CommentBody';
import axios from 'axios';

class Comment extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			replies: []
		}
		this.getReplies = this.getReplies.bind(this);
	}

	getReplies(t) {
		let time;
		
		axios.get('http://localhost:8080/children.json?id='+this.props.id, {crossdomain: true})
			.then(res => {
				if (res.data.data && res.data.data.length > 0) {
					this.setState({ replies: res.data.data });
					time = 5000;
				} else {
					time = (t>120000 ? 120000 : t + 5000);
				}

				setTimeout(this.getReplies(time), t);
			});
	}

	componentDidMount() {
		this.getReplies(5000);
	}

	render() {
	let replies = this.state.replies.map(r => {
		return (
			<Comment
				id={r._id}
				author={r.author}
				permalink={r.permalink}
				body={r.body}
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
					className="replies list-group" 
					id={this.props.id+'-replies'}
				>
					{replies}
				</ul>
			</li>
		);
	}
};

export default Comment;
