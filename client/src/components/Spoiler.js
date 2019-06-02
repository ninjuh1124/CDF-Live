import React from 'react';

const Spoiler = (props) => {
	return (
		<span className="spoiler">
			{props.outerText}
			<span className="spoiler-inner">
				{props.innerText}
			</span>
		</span>
	)
}
