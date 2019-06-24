import React from 'react';

const Author = (props) => {
	return (
		<a
			href={props.permalink}
			className="username"
			rel="noreferrer noopener"
			target="_blank"
		><strong>
			{props.author}
		</strong></a>
	)
}

export default Author;
