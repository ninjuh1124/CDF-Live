import React from 'react';
import CommentHandler from './CommentHandler';

const CommentBody = (props) => {
	let body = parseBody(props.body);
	return (
		<div className="body-row row">
			<div className="body-col col-xs-11">
				<CommentHandler body={props.body} /> 
			</div>
			<div className="arrow-col col-xs-1">
				<a
					href={props.permalink}
					target="_blank"
					rel="noopener noreferrer"><h2
					className="arrow-link text-center"><i
					className="fa fa-angle-right"></i></h2></a>
			</div>
		</div>
	);
};

export default CommentBody;
