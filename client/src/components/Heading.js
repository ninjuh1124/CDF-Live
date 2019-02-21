import React from 'react';
import axios from 'axios';

class Heading extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			thread: {}
		}
	}

	componentDidMount() {
		axios.get(
			this.props.api+'v1/thread.json',
			{ crossdomain: true }
		).then(res => {
			this.setState({ thread: res.data.message[0] });
		});	
	}

	render() {
		return (
			<div className="heading">
				<h2
					className="text-center"
					id="title">Casual Discussion Friday</h2>
				<a
					id="latest"
					href={
						this.state.thread.permalink ? 
						this.state.thread.permalink :
						"https://reddit.com/r/anime"
					}
					rel="noreferrer noopener"
					target="_blank"
				><h5 className="text-center">Latest Thread</h5></a>
				<hr />
			</div>
		);
	}
}

export default Heading;
