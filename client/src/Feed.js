import React from 'react';
import Comment from './Comment';
import BSort from './BSort';
import axios from 'axios';

class Feed extends React.Component {
	constructor() {
		super();
		this.state = { history: [] };
		this.getHistory = this.getHistory.bind(this);
	}

	getHistory() {
		axios.get(
			'http://192.168.0.167:8080/v1/history.json?newerthan='+this.state.history[0]._id,
			{ crossdomain: true }
		).then(res => {
			if (res.data.err) console.log(res.data.err);
			if (res.data.data &&
				Array.isArray(res.data.data) &&
				res.data.data.length > 0) {
					this.setState(state => {
						return {
							history: [...res.data.data, ...state.history]
						};
					});
				}
		}).catch(res => {
			console.log(res);
		})
	}

	componentDidMount() {
		axios.get(
			'http://192.168.0.167:8080/v1/commenttree.json', 
			{crossdomain: true}
		).then(res => {
			if (res.data.err) console.log(res.data.err);
			this.setState({ history: BSort(res.data.data, 'id') });
			console.log(this.state.history[0]);

			setInterval(this.getHistory, 10000);
		}).catch(res => {
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
