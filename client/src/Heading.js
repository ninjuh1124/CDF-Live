import React from 'react';

var Heading = (props) => {
	return (
		<div className="heading">
			<h2>Casual Discussion Friday</h2>
			<a
				href={props.thread.permalink}
				target="_blank"
			><h5>Latest Thread</h5></a>
			<hr />
		</div>
	);
};


export default Heading;
