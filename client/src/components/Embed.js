import React, { useState } from 'react';
import psl from 'psl';
import path from 'path';
import ReactPlayer from 'react-player';
import { TweetEmbed } from 'react-twitter-embed';

/*
const ReactPlayer = React.lazy(() => import('react-player'));
const TweetEmbed = React.lazy(() => import('react-twitter-embed'))
*/

const Embed = (props) => {
	const [hidden, toggleHidden] = useState(true);

	return <>
		<button		// show/hide button
			className={hidden ?
					'embed-button-hidden' :
					'embed-button-show'}
			onClick={() => toggleHidden(!hidden)}
		>
			{hidden ? '+' : '-'}
		</button>
		{ hidden && null
			// TODO figure out a not dumb way to write this
		}
	</>
};

export default Embed;
