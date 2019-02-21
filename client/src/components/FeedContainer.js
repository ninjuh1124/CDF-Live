import React from 'react';
import {Link} from 'react-router-dom';
import Feed from './Feed';
import Heading from './Heading';

class FeedContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			thread: {},
		};
	}

	render() {
		return (
			<div style={{padding: '3px'}}>
				<h6
					className="text-right"
				><small>
					<Link to="/about" className="corner-link">About</Link>
				</small></h6>
				<Heading api={this.props.api} />
				<Feed api={this.props.api} />
			</div>
		);
	}
}

export default FeedContainer; 
