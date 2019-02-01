import React, { Component } from 'react';
import himalaya from 'himalaya';
import ReactDOMServer from 'react-dom/server';
//import Heading from './Heading';
//import Feed from './Feed';

/*
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
*/

import ReactMarkdown from 'react-markdown';

let App = () => {
	return (
		<MyDiv md='[Hello World](https://reddit.com)' />
	)
}

class MyDiv extends React.Component {
	render() {
		let html = makeHtml(this.props.md);
		return <div dangerouslySetInnerHTML={{ __html: html }} />
	}
}


const makeHtml = (md) => {
	let jsx = <ReactMarkdown source={md} />
	return ReactDOMServer.renderToStaticMarkup(jsx)
}

export default App;
