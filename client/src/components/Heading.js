import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import EditorContainer from '../containers/EditorContainer';
import RedditButton from '../resources/RedditButton';

import useThread from '../hooks/useThread';

import { RedditContext } from '../context';

const Heading = props => {
	const [editorMode, toggleEditor] = useState('hidden');
	const thread = useThread();
	const reddit = useContext(RedditContext);

	let uriBase = "https://reddit.com/api/v1/authorize?",
		redirect = encodeURIComponent(process.env.REACT_APP_REDIRECT),
		scope = ["edit", "read", "save", "submit", "vote", "identity"],
		params = [
			`client_id=${process.env.REACT_APP_CLIENT_ID}`,
			"response_type=code",
			`state=${reddit.device}`,
			`redirect_uri=${redirect}`,
			"duration=permanent",
			`scope=${scope.join('+')}`
		].join('&');

	return (
		<div className="heading">
			<h6 className="corner-link" id="about"><small>
				<Link to="/about" className="link-primary">
					About
				</Link>
			</small></h6>

			<h2 id="title">Casual Discussion Friday</h2>
			<h5 id="latest"><a
				className="link-primary"
				href={
					thread.permalink ? 
					thread.permalink :
					"https://reddit.com/r/anime"
				}
				rel="noreferrer noopener"
				target="_blank"
			>{thread.error || 'Latest Thread'}</a></h5>

			{ thread.error &&
				<h5 className='text-error'>{thread.error}</h5> }

			<h6 id='logged-in-as'>
				{ reddit.refreshToken &&
				(reddit.user.name ? 
					<small>
						Logged in as {reddit.user.name} (<a 
							href='javascript:void(0)'
							onClick={() => setRefreshToken(null)}>logout</a>)
					</small> : 
					<small>Loading user info...</small>)
				}
			</h6>

			<hr id='topbar' />
	
			{ reddit.user ?
				(<RedditButton
					onClick={() => toggleEditor(editorMode === 'hidden' ?
						'reply' :
						'hidden')
					}
				>reply to thread</RedditButton>) :
				(<a
					id="reddit-login-button"
					href={uriBase+params}
				><i className="fab fa-reddit" />Login</a>)
			}

			{ editorMode === 'hidden' ||
				<EditorContainer
					editorMode={editorMode}
					toggleEditor={() => toggleEditor('hidden')}
				/>	
			}
		</div>
	);
};

export default Heading;
