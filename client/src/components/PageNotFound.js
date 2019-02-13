import React from 'react';
import {Link} from 'react-router-dom';

const PageNotFound = () => {
	return (
		<div>
			<h1 className="text-center">This page does not exist</h1>
			<hr />
			<h1 className="text-center">
				<Link to='/feed'>
					<img alt="" src="/faces/akarislap.gif"></img>
				</Link>
			</h1>
		</div>
	);
}

export default PageNotFound;
