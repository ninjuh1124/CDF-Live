import React from 'react';
import CommentContainer from './CommentContainer';
import Heading from './Heading';
import axios from 'axios';

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			thread: {},
		};
	}

	render() {
		return (
			<div>
				<Heading api={this.props.api} />
				<CommentContainer api={this.props.api} />
			</div>
		);
	}
}

export default Feed; 
