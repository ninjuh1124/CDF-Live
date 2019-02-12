import React, { Component } from 'react';
import Heading from './Heading';
import Feed from './Feed';
import axios from 'axios';
import './style.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			latestThread: ""
		}
	}

	componentDidMount() {
		axios.get('http://192.168.0.167:8080/v1/thread.json', {crossdomain: true})
			.then(res => {
				this.setState({ latestThread: res.data.data[0] });
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
