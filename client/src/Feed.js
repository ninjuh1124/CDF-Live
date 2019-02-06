import React from 'react';
import Comment from './Comment';
import axios from 'axios';

class Feed extends React.Component {
	constructor() {
		super();
		this.state = { history: [] };
	}

	componentDidMount() {
		axios.get('http://localhost:8080/v1/parenthistory.json', {crossdomain: true})
			.then(res => {
				this.setState({ history: res.data.data })
			})
			.catch(res => {
				// handle rejection
			});
	}

	render() {
		let comments = this.state.history.map(comment => {
			return(
				<Comment
					id={comment._id}
					key={comment.id}
					author={comment.author}
					permalink={comment.permalink}
					body={comment.body}
				/>
			);
		});

		return (
			<ul className="list-group" id="feed">
				{
					this.state.history.length > 0 ? 
					comments :
					<li
						style={{'textAlign': 'center'}} 
						className="list-group-item">
							Loading...
					</li>
				}
			</ul>
		);
	}
}

export default Feed; 
