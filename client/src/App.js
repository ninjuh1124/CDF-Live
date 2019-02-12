import React, { Component } from 'react';
import Feed from './components/Feed';
import axios from 'axios';
import {
	BrowserRouter as Router,
	Route,
	Link
	} from 'react-router-dom';
import './style.css';

class App extends Component {
	render() {
		return (
			<div className="content">
				<Feed api="http://localhost:8080/v1/"/>
			</div>
		);
	}
}

export default App;
