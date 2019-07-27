import React from 'react';
import facecodes from './facecodes';

const CommentFace = (props) => {
	return(
		<span className="comment-face" title={props.title}>
			<img
				src={facecodes[props.code]
					? facecodes[props.code]
					: '/faces/notfound.jpg'}
				alt={props.code}
				className="face"
			/>
			<span className="face-text">{props.children}</span>
		</span>
	)
}

export default CommentFace;
