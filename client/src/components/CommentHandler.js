import React from 'react';
import ReactMarkdown from 'react-markdown';
import CommentFace from './CommentFace';
import Spoiler from './Spoiler';

const CommentHandler = (props) => {
	return <ReactMarkdown
		source={props.body.replace(/^#{1,}/gm, '$& ')}
		disallowedTypes={['imageReference', 'linkReference']}
		renderers={{
			paragraph: props => <p className="md">{props.children}</p>,

			link: props => {
				if (/^#\S+/.test(props.href)) {			// check face
					return <CommentFace
						code={props.href}
						title={props.title}
						children={props.children}
					/>
				} else if (/^\/s$/.test(props.href)) {	// check spoiler
					return <Spoiler
						outerText={props.children}
						innerText={props.title}
					/>
				} else if (/\/?[ur]\/\S+/.test(props.href)) { // reddit link
					return <a
						href={"https://reddit.com/"+props.href}
						title={props.title}
						target="_blank"
						rel="noreferrer noopener"
					>{props.children}</a>
				} else {
					return <a 
						href={props.href} 
						title={props.title}
						target="_blank"
						className="md-link"
						rel="noreferrer noopener"
					>{props.children}</a>
				}
			}
		}}
	/>
}

export default CommentHandler;
