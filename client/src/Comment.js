import React from 'react';
import CommentBody from './CommentBody';
import axios from 'axios';

class Comment extends React.Component {
	constructor(props) {
		super(props);
		this.state= {
			replies: []
		}
	}

	componentDidMount() {
		setInterval(async () => {
			const r = await axios.get('http://localhost:8080/children.json?id='+props.id);
			if (r.data.length > 0) {
				this.setState({ replies: r.data });
			}
		}, 30000);
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
			<div className="comment" id={props.id}>
				<CommentAuthor
					author={props.author} 
					permalink={props.permalink}
				/>
				<CommentBody id={props.id} body={props.body} />
				<div className="-replies" id={props.id+'-replies'}>
					{replies}
				</div>
			</div>
		);
	}
};

const CommentAuthor = (props) => {
	return (
		<div id={props.author+"-author"}>
			<a href={props.permalink} target="_blank">{props.author}</a>
		</div>
	);
}

export default Comment;
