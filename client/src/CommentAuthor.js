import React from 'react';

const CommentAuthor = (props) => {
	return (
		<div className="author-row row">
			<div className="author-col col-xs-2">
				<h5 className="author-link">
					<a 
						href={props.permalink} 
						target="_blank">{props.author}</a>
				</h5>
			</div>
		</div>
	);
}

export default CommentAuthor;
