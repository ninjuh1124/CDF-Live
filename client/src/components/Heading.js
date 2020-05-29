import React from 'react';
import { Link } from 'react-router-dom';

const Heading = props => (
	<div className="heading">
		<h6 className="corner-link" id="about"><small>
			<Link to="/about" className="link-primary">
				About
			</Link>
		</small></h6>
		<h6 className="corner-link" id="about"><small>
			<Link to="/changelog" className="link-primary">
				Changelog
			</Link>
		</small></h6>

		<h2 id="title">{props.title}</h2>

		{props.prebar}

		<hr id='topbar' />

		{props.postbar}

	</div>
);

export default Heading;
