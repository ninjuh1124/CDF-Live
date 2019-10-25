import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import axios from 'axios';

const About = props => {
	const [md, changeMd] = useState('Loading');

	useEffect( () => {
		axios.get(
			process.env.REACT_APP_API+"content/about.md",
			{ crossorigin: true }
		).then(res => {
			changeMd(res.data);
		});
	}, []);

	return (
		<div>
			<h6
				className="text-right"
			><small>
				<Link to='/feed' className="corner-link">Feed</Link>
			</small></h6>

			<h6
				className="text-right"
			><small>
				<Link to='/changelog' className="corner-link">Changelog</Link>
			</small></h6>

			<h2
				className="text-center"
				id="title">About</h2>
			<hr />
			<ReactMarkdown source={md} />
		</div>
	);
}

export default About;
