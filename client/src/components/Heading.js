import React from 'react';
import { Link } from 'react-router-dom';

const Heading = props => (
	<div className='heading'>
		<nav className='nav-links'>
			<h5><small>
				<Link to='/feed' className='nav-link'> Feed</Link>
				<Link to='/about' className='nav-link'> About</Link>
				<Link to='/changelog' className='nav-link'> Changelog</Link>
			</small></h5>
		</nav>

		<h2 id="title">{props.title}</h2>

		{props.children}

	</div>
);

export default Heading;
