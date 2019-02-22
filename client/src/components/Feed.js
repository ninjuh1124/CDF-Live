import React from 'react';
import axios from 'axios';
import Comment from './Comment';
import BSort from '../resources/BSort';

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [],
			isLoading: false,
			emptyCalls: 0
		};
		this.getHistory = this.getHistory.bind(this);
	}

	// do things functionally they said
	// your code will look cleaner they said
	getHistory() {
		axios.get(
			this.props.api+'v1/history.json?newerthan='+this.state.history[0]._id,
			{ crossdomain: true }
		).then(res => {
			// check history
			if (res.data.message
				&& Array.isArray(res.data.message)
				&& res.data.message.length > 0) {
					// update history
					this.setState(state => {
						return {
							history: BSort([
								...res.data.message.filter(comment => {
									return !(this.state.history
										.map(comment => comment._id)
										.includes(comment._id)
									);
								}),
								...state.history
							], 'id'),
							emptyCalls: 1
						};
					});
				} else {
					this.setState(state => {
						return { emptyCalls: state.emptyCalls + 1 }
					});
				}
			
			// call get history again
			setTimeout( () => this.getHistory(), 
				(this.state.emptyCalls < 24
					? this.state.emptyCalls*5000
					: 24*5000
				)
			);
		});
	}

	componentDidMount() {
		this.setState({ isLoading: true }, () => {
			axios.get(
				this.props.api+'v1/commenttree.json',
				{ crossdomain: true }
			).then(res => {
				if (res.data.err) console.log(res.data.err);
				this.setState({ 
					history: BSort(res.data.message, 'id'),
					isLoading: false
				});
				setTimeout( () => this.getHistory(), 5000);
			}).catch(err => {
				this.setState({ isLoading: false });
				console.log(err);
			});
		});
	}

	render() {
		let comments = this.state.history
			.filter(comment => comment.parentID > 't3_000000')
			.map(comment => {
				return (
					<div style={{ marginTop: '5px'}} key={comment.id}>
						<Comment
							id={comment._id}
							key={comment.id}
							author={comment.author}
							body={comment.body}
							permalink={comment.permalink}
							created={comment.created}
							history={this.state.history}
							className="parent"
						/>
					</div>
				);
			});

			return (
				<ul className="list-group" id="feed">
					{
						this.state.isLoading > 0
						? <li
							style={{textAlign: 'center'}}
							className="comment list-group-item">
								Loading...
						  </li>
						: (this.state.history.length > 0
						  ? comments
						  : <li
						  		style={{textAlign: 'center'}}
								className="comment list-group-item"
							>
								"Error loading comments"
							</li>)
					}
				</ul>
			);
	}
}

export default Feed;
