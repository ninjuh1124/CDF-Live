import React from 'react';
import TimeAgo from 'react-timeago';

const CommentAuthor = (props) => {
	return (
		<div className="author-row row"><div className="col-xs-11"><h5>
			<a 
				href={props.permalink} 
				rel="noreferrer noopener"
				target="_blank"
			>{props.author}</a>

			<span 
				className="link-primary" 
				style={{float: 'right'}}
				title={new Date(props.created*1000)}
			>
				<TimeAgo 
					date={props.created * 1000} 
					title={null}
				/>
			</span>
		</h5></div></div>
	);
}

export default CommentAuthor;
