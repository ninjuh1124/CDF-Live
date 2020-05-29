import React from 'react';
import { map as facecodes } from '../resources/facecodes';

const CommentFace = (props) => {
	if (!facecodes[props.code]) {
		let style = {
			height: '125px',
			width: '125px'
		}
		return (
			<span className="comment-face" 
				style={style} title={props.title}>
				<span className='face-text'>{props.children}</span>
				<img src='/faces/active/umiface.jpg' alt='#facenotfound'
					className='face face-discontinued' style={style} />
			</span>
		);
	}

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
					className={"face" + (facecodes[props.code].active ?
						'' :
						' face-discontinued')
					}
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
