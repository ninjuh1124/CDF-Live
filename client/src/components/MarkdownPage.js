import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

import { query } from '../utils/appAPI'

const MarkdownPage = props => {
	const [md, changeMd] = useState('Loading');

	query(props.endpoint)
		.then(markdown => changeMd)
		.catch(err => {
			changeMd(`Error loading content: ${err}`);
		});

	return (
		<div>
			<h6
				className="corner-link"
			><small>
				<Link to='/feed'>Feed</Link>
			</small></h6>

			<Heading title={props.title} />

			<ReactMarkdown source={md} />
		</div>
	);
}

export default MarkdownPage;
