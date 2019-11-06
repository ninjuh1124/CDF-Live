import React from 'react';

const Popover = props => {
	return props.hide || (
		<div className="popover-wrapper">
			{props.children}
			<div className="popover-content" style={{overflowY: 'scroll'}}>
				{props.render}
			</div>
		</div>
	);
};

export default Popover;
