import React from 'react';
import Comment from './Comment';
import axios from 'axios';

class Feed extends React.Component {
	constructor() {
		super();
		this.state = { history: [] };
	}

	componentDidMount() {
		axios.get('http://localhost:8080/v1/parenthistory.json')
			.then(res => this.setState({ history: res.data }));
	}

	render() {
		let comments = this.state.history.map(comment => {
			return(
				<Comment
					id={comment._id}
					author={comment.author}
					permalink={comment.permalink}
					body={comment.body}
				/>
			);
		});

		return (
			<div id="feed">
				{comments}
			</div>
		);
	}
}

export default Feed; 
