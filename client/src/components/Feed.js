import React from 'react';
import {Link} from 'react-router-dom';
import CommentContainer from './CommentContainer';
import Heading from './Heading';

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
				<h6
					className="text-right"
				><small>
					<Link to="/about" className="corner-link">About</Link>
				</small></h6>
				<Heading api={this.props.api} />
				<CommentContainer api={this.props.api} />
			</div>
		);
	}
}

export default Feed; 
