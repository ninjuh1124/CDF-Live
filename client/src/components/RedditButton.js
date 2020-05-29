import React from 'react';

const RedditButton = props => (
	<a
		className={props.className || 'reddit-button link-primary'}
		href={props.href || 'javascript:void(0)'}
		onClick={props.onClick}
		{...props}
	>{props.children}</a>
);

export default RedditButton;
