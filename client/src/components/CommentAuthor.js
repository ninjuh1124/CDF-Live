import React from 'react';
import TimeAgo from 'react-timeago';

const CommentAuthor = (props) => {
	return (
		<div className="author-row row">
			<div className="author-col col-xs-2">
				<h5 className="author-link">
					<a 
						href={props.permalink} 
						rel="noreferrer noopener"
						target="_blank"
					>{props.author}</a>
				</h5>
			</div>
			<div className="col-xs-9">
				<h5 className="time-ago text-right">
					<TimeAgo 
						date={props.created * 1000} 
						title={null}
					/>
				</h5>
			</div>
		</div>
	);
}

export default CommentAuthor;
