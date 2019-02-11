import React from 'react';
import Comment from './Comment';
import axios from 'axios';

class Feed extends React.Component {
	constructor() {
		super();
		this.state = { history: [] };
	}

	componentDidMount() {
		axios.get('http://localhost:8080/v1/commenttree.json', {crossdomain: true})
			.then(res => {
				this.setState({ history: res.data.data })
			})
			.catch(res => {
				console.log(res);
			});
	}

	render() {
		let comments = this.state.history
			.filter(comment => comment.parentID > 't3_000000')
			.map(comment => {
			return(
				<Comment
					id={comment._id}
					key={comment.id}
					author={comment.author}
					permalink={comment.permalink}
					body={comment.body}
					history={this.state.history}
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
