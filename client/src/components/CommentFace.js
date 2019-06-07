import React from 'react';
import facecodes from '../resources/facecodes';

const CommentFace = (props) => {
	return(
		<span className="comment-face">
			<img
				src={facecodes[props.code]
					? facecodes[props.code]
					: '/faces/notfound.jpg'}
				alt={props.code}
				title={props.title}
				className="face"
			/>
			<span className="face-text">{props.children}</span>
		</span>
	)
}

export default CommentFace;
