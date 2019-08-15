import React from 'react';
import CommentFace from './CommentFace';
import Spoiler from './Spoiler';

const supportsStringRender = parseInt((React.version || '16').slice(0, 2), 10) >= 16
const createElement = React.createElement

export default {
	sup: props => {
		return <sup>{props.children}</sup>
	},

	link: props => {
		if (/^#\S+/.test(props.href)) {
			return <CommentFace
				code={props.href}
				title={props.title}
				children={props.children}
			/>
		} else if (/^\/s$/.test(props.href)) {
			return <Spoiler
				outerText={props.children}
				innerText={props.title}
			/>
		} else if (/^\/?[ur]\/\S+/.test(props.href)) {
			return <a
				href={'https://reddit.com/'+props.href}
				title={props.title}
				target='_blank'
				className='md-link'
				rel='noreferrer noopener'
			>{props.children}</a>
		} else {
			return <a
				href={props.href}
				title={props.title}
				target='_blank'
				className='md-link'
				rel='noreferrer noopener'
			>{props.children}</a>
		}
	}
}
