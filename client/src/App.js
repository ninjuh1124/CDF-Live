import React, { Component } from 'react';
import Heading from './Heading';
import Feed from './Feed';

class App extends Component {
	constructor() {
		super();
		this.state = {
			latestThread: "";
		}
	}

	componentDidMount() {
		fetch('http://localhost:8080/v1/thread.json')
			.then(res => res.json())
			.then(res => {
				this.setState({ latestThread: res.data[0] });
			});
	}

	render() {
		return (
			<div className="content">
				<Heading thread={this.state.latestThread}/>
				<Feed />
			</div>
		);
	}
}

export default App;
