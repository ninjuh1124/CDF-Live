import React { useState } from 'react';
import psl from 'psl';
import path from 'path';
const ReactPlayer = React.lazy(() => import('react-player'));
const TweetEmbed = React.lazy(() => import('react-twitter-embed'))
	.then(t => t.TwitterTweetEmbed);

const Embed = (props) => {
	const [hidden, toggleHidden] = useState(true);

	<>
		<button		// show/hide button
			className={hidden ?
					'embed-button-hidden' :
					'embed-button-show'}
			onClick={() => toggleHidden(!hidden)}
		>
			{hidden ? '+' : '-'}
		</button>
		{ hidden &&
			// TODO figure out a not dumb way to write this
		}
	</>
};

export default Embed;
