import React from 'react';
import { parseBody } from './CommentHandler';

const CommentBody = (props) => {
	let body = parseBody(props.body);
	return (
		<div className="body-row row">
			<div className="body-col col-xs-11">
				<span 
					className="comment-body" 
					id={props.id} 
					dangerouslySetInnerHTML={{__html: body}}></span>
			</div>
			<div className="arrow-col col-xs-1">
				<a
					href={props.permalink}
					rel="noopener noreferrer"><h2
					target="_blank"
					className="arrow-link text-center"><i
					className="fa fa-angle-right"></i></h2></a>
			</div>
		</div>
	);
};

export default CommentBody;
