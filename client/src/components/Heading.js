import React from 'react';
import {Link} from 'react-router-dom';

const Heading = (props) => {
	let uriBase = "https://reddit.com/api/v1/authorize?",
		redirect = encodeURIComponent("http://localhost:3000/reddit_oauth_login"),
		scope = ["edit", "read", "save", "submit", "vote", "identity"],
		params = [
			"client_id=WfSifmea8-anYA",
			"response_type=code",
			"state=" + localStorage.getItem('device'),
			"redirect_uri=" + redirect,
			"duration=permanent",
			"scope=" + scope.join('+')
		].join('&');
	return (
		<div className="heading">
			<h6 className="text-right"><small>
				<Link to="/about" className="corner-link link-primary">
					About
				</Link>
			</small></h6>

			<h2
				className="text-center"
				id="title">Casual Discussion Friday</h2>
			<h5 className="text-center"><a
				id="latest"
				className="link-primary"
				href={
					props.thread.permalink ? 
					props.thread.permalink :
					"https://reddit.com/r/anime"
				}
				rel="noreferrer noopener"
				target="_blank"
			>Latest Thread</a></h5>

			<span className="text-right link-primary">
				{localStorage.getItem('refreshToken') === null
				? null
				:	props.loggedInAs
					? "Logged in as " + props.loggedInAs
					: "Loading user info..."
				}
			</span>

			<hr />

			{localStorage.getItem('refreshToken') !== null
			? null
			: <a
				id="reddit-login-button"
				href={uriBase+params}
			><i className="fab fa-reddit" /> Login</a>}
		</div>
	);
}


export default Heading;
