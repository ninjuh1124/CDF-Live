import React from 'react';
import popover from '../styles/popover.module.scss';

const Popover = props => {
	return (
		<div className={popover.wrapper}>
			{props.children}
			{props.hide || <div className={popover.content}>
				{props.render}
			</div>}
		</div>
	);
};

export default Popover;
