import React from 'react';

const RedditButton = props => (
	<button
		className={props.className || 'reddit-button link-primary'}
		disabled={props.disabled}
		onClick={props.onClick}
		{...props}
	>{props.children}</button>
);

export default RedditButton;
