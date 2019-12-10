import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import EditorContainer from '../containers/EditorContainer';
import RedditButton from '../resources/RedditButton';

import { getMe } from '../resources/redditAPI';
import { getThread, getAccessToken } from '../resources/appAPI';

const Heading = props => {
	const [editorMode, toggleEditor] = useState('hidden');
	const [error, setError] = useState(null);

	const keepGettingAccessToken = () => {
		setTimeout( () => {
			getAccessToken(props.refreshToken)
				.then(res => {
					if (res.message.accessToken) {
						props.setAccessToken(res.message.access_token);
					}
				})
				.catch(err => {
					setError(err);
					console.log(err);
				});

			keepGettingAccessToken();
		}, 3300000)
	}

	useEffect( () => {
		getThread()
			.then(res => props.updateThread(res.message[0]))
			.catch(err => {
				setError(err);
				console.log(err);
			});

		if (props.refreshToken) {
			getAccessToken(props.refreshToken)
				.then(res => {
					if (res.message.access_token) {
						props.setAccessToken(res.message.access_token);
					}

					if (!props.loggedInAs) {
						getMe(props.accessToken)
							.then(d => props.setUser(d.name));
					}
				})
				.catch(err => {
					setError(err);
					console.log(err);
				});

			keepGettingAccessToken();
		}
	}, []);

	let uriBase = "https://reddit.com/api/v1/authorize?",
		redirect = encodeURIComponent(process.env.REACT_APP_REDIRECT),
		scope = ["edit", "read", "save", "submit", "vote", "identity"],
		params = [
			`client_id=${process.env.REACT_APP_CLIENT_ID}`,
			"response_type=code",
			`state=${localStorage.getItem('device')}`,
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
					props.thread.permalink ? 
					props.thread.permalink :
					"https://reddit.com/r/anime"
				}
				rel="noreferrer noopener"
				target="_blank"
			>Latest Thread</a></h5>

			<h6 id='logged-in-as'>
				{props.refreshToken &&
				(props.loggedInAs
					? <small>
						Logged in as {props.loggedInAs} (<a 
							href='javascript:void(0)'
							onClick={props.logout}>logout</a>)
					</small>
					: <small>Loading user info...</small>)
				}
			</h6>

			<hr id='topbar' />
	
			{props.isLoggedIn ?
				(<RedditButton
					onClick={() => toggleEditor(editorMode === 'hidden' ?
						'reply' :
						'hidden')
					}
				>reply to thread</RedditButton>) :
				(<a
					id="reddit-login-button"
					href={uriBase+params}
				><i className="fab fa-reddit" /> Login</a>)
			}

			{editorMode === 'hidden' ||
				<EditorContainer
					editorMode={editorMode}
					toggleEditor={() => toggleEditor('hidden')}
				/>	
			}
		</div>
	);
}

export default Heading;
