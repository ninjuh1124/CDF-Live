import React from 'react';

var Heading = (props) => {
	return (
		<div className="heading">
			<h2 className="text-center">Casual Discussion Friday</h2>
			<a
				id="latest"
				href={props.thread.permalink}
				rel="noreferrer noopener"
				target="_blank"
			><h5 className="text-center">Latest Thread</h5></a>
			<hr />
		</div>
	);
};


export default Heading;
