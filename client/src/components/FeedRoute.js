import React, { useContext } from 'react';

import Editor from './Editor';
import RedditButton from './RedditButton';

import useThread from '../hooks/useThread';
import useFeed from '../hooks/useFeed';
import useEditor from '../hooks/useEditor';

import { FeedProvider, RedditContext } from '../context';

import Feed from './Feed';
import Heading from './Heading';

const FeedRoute = props => {
	const feed = useFeed();
	const thread = useThread();
	const editor = useEditor({
		_id: thread._id,
		text: '',
		defaultType: 'reply'
	});

	const reddit = useContext(RedditContext);

	let uriBase = 'https://reddit.com/api/v1/authorize',
		redirect = encodeURIComponent(process.env.REACT_APP_REDIRECT),
		scope = ['edit', 'read', 'save', 'submit', 'vote', 'identity'],
		params = [
			`client_id=${process.env.REACT_APP_CLIENT_ID}`,
			`response_type=code`,
			`state=${reddit.device}`,
			`redirect_url=${redirect}`,
			`duration=permanent`,
			`scope=${scope.join('+')}`
		].join('&');

	return (
		<div style={{ padding: '3px' }}>
			<Heading title='Casual Discussion Friday'>
				{<>
				<h5 id='latest'>
					<a
						className='link-primary'
						href={
							thread.permalink ?
							thread.permalink :
							'https://reddit.com/r/anime'
						}
						rel='noreferrer noopener'
						target='_blank'
					>Latest Thread
					</a>
				</h5>

				{reddit.refreshToken === null ||
				<h6 id='logged-in-as'>
					{reddit.user === '' ?
					'Loading user info'
					:
					`Logged in as ${reddit.user}`
					}
				</h6>
				}
				</>}

				<hr id='topbar' />
				{<>
					{reddit.user ?
						<RedditButton
							onClick={() => {
								editor.setShowEditor(true);
							}}
						>reply to thread</RedditButton> 
						:
						<a
							id='reddit-login-button'
							href={`${uriBase}?${params}`}
						><i className='fab fa-reddit' />Login</a>
					}

					{reddit.user !== null && editor.showEditor && 
						<Editor editor={editor} />}
				</>}
			</Heading>

			<FeedProvider defaultValue={{...feed}}>
				<Feed />
			</FeedProvider>
		</div>
	);
}

export default FeedRoute
