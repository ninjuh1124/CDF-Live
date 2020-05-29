import React from 'react';
import CommentFace from '../components/CommentFace';
import Spoiler from '../components/Spoiler';
import Embed from '../components/Embed';

import psl from 'psl';
import path from 'path';

const embedMedia = url => {
	const extensions = [
		// video extensions
		'mp4',
		'ogv',
		'webm',
		'mp3',

		// image extensions
		'jpg',
		'jpeg',
		'jpe',
		'jif',
		'jfif',
		'jfi',
		'png',
		'webp',
		'gif',
		'tiff',
		'tif',
		'svg',
		'bmp'
	].map(ext => `.${ext}`);

	let domains = [
		'youtube.com',
		'youtu.be',
		'facebook.com',
		'streamable.com',
		'vimeo.com',
		'twitch.tv',
		'dailymotion.com',
		'soundcloud.com',
		// 'pixiv.net',
		'twitter.com'
	];

	return (
		extensions.includes(path.extname(url)) ||
		domains.includes(psl.parse(url).domain)
	)
}

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
			return <>
				<a
					href={'https://reddit.com/'+props.href}
					title={props.title}
					target='_blank'
					className='md-link'
					rel='noreferrer noopener'
				>{props.children}</a>
				
				{	// renders video or music links
					embedMedia(props.href) &&
						<Embed url={props.href} />
				}
			</>
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
