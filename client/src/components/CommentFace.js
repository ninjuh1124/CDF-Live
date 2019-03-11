import React from 'react';
import facecodes from '../resources/facecodes';

const CommentFace = (props) => {
	return(
		<span className="comment-face">
			<img
				src={facecodes[props.facecode]}
				alt={props.facecode}
				title={props.title}
				className="face"
			/>
			{props.topText
			? <span className="top">{props.topText}</span>
			: null}
			{props.bottomText
			? <span className = "bottom">{props.bottomText}</span>
			: null}
		</span>
	)
}

export default CommentFace;
