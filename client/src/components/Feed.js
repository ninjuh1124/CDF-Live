import React from 'react';
import axios from 'axios';
import Comment from './Comment';
import BSort from '../resources/BSort';

class Feed extends React.Component {
	render() {
		let comments = this.props.history
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
							history={this.props.history}
							loggedIn={this.props.loggedIn}
							className="parent"
						/>
					</div>
				);
			});

			return (
				<ul className="list-group" id="feed">
					{comments.length >= 1
					? comments
					: <p>Something went wrong :(</p>
					}
				</ul>
			);
	}
}

export default Feed;
