import React from 'react';
import facecodes from './facecodes';

const CommentFace = (props) => {
	if (!facecodes[props.code]) return null;
	let style = {
		height: facecodes[props.code].height+'px',
		width: facecodes[props.code].width+'px'
	}
	return(
		<span className="comment-face" style={style} title={props.title}>
			{ facecodes[props.code].type !== 'hover' ?
				<img
					src={ '/faces/' +
						(facecodes[props.code].active ? 
							'active/' : 
							'discontinued/'
						) +
						facecodes[props.code].filename
					}
					alt={props.code}
					className="face"
					style={style}
				/> :
				<><img
					src={ '/faces/' +
						(facecodes[props.code].active ? 
							'active/' : 
							'discontinued/'
						) +
						facecodes[props.code].filename2
					}
					alt={props.code}
					className="face face-hover"
					style={style}
				/><img
					src={ '/faces/' +
						(facecodes[props.code].active ? 
							'active/' : 
							'discontinued/'
						) +
						facecodes[props.code].filename1
					}
					alt={props.code}
					className="face face-no-hover"
					style={style}
				/>
				</>
			}
			<span className="face-text">{props.children}</span>
		</span>
	)
}

export default CommentFace;
