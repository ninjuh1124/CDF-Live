import React from 'react';

import EditorContainer from '../containers/EditorContainer';
import RedditButton from './RedditButton';

import useThread from '../hooks/useThread';
import useFeed from '../hooks/useFeed';
import useEditor from '../hooks/useEditor';

import { RedditContext } from '../context';

import Feed from './Feed';
import Heading from './Heading';

const FeedRoute = props => {
	const thread = useThread();
	const feed = useFeed();
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
			<Heading
				title='Casual Discussion Friday'

				prebar={() => {
					<h5 id='latest'><a
						className='link-primary'
						href={
							thread.permalink ?
							thread.permalink :
							'https://reddit.com/r/anime
						}
						rel='noreferrer noopener'
						target='_blank'
					>{thread.error || 'Latest Thread'}</a></h5>

					{thread.error &&
						<h5 className='text-error'>{thread.error}</h5>
					}

					<h6 id='logged-in-as'>
						{reddit.refreshToken &&
							reddit.user.name ?
							<small>
								Logged in as {reddit.user.name} <a
									href='javascript:void(0)'
									onClick={() => {
										reddit.setRefreshToken(null)
									}}>(logout)</a>
							</small> :
							<small>Loading user info...</small>
						}
					</h6>
				}}

				postbar={() => {
					{reddit.user ?
						(
							<RedditButton
								onClick{() => {
									editor.setShowEditor(true);
								}}
							>reply to thread</RedditButton>
						) :
						(
							<a
								id='reddit-login-button'
								href={`${uriBase}?${params}`}
							><i className='fab fa-reddit' />Login</a>
						)
					}

					{editor.showEditor &&
						<Editor editor={editor} />
					}
				}}
			/>

			<FeedProvider defaultValue={feed}>
				<Feed />
			</FeedProvider>
		</div>
	);
}

export default FeedRoute
