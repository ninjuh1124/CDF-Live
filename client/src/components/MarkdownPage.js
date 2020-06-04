import React, { useState } from 'react';

import { Link } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';

import { query } from '../utils/appAPI'

import Heading from './Heading';

const MarkdownPage = props => {
	const [md, changeMd] = useState('Loading');

	query(props.endpoint)
		.then(markdown => { 
			console.log(markdown);
			changeMd(markdown); 
		})
		.catch(err => {
			changeMd(`Error loading content: ${err}`);
		});

	return (
		<div className='markdown-page'>
			<Heading title={props.title} />
			<ReactMarkdown source={md} />
		</div>
	);
}

export default MarkdownPage;
