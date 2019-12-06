import React, { useState } from 'react';
import Popover from './Popover';

import { list } from '../resources/facecodes';

/** Editor formatting bar for one-click markdown insertions **/
const FormattingBar = props => {
	const [hidePopover, toggleHidden] = useState(true);

	return <div>
		<Button onClick={() => props.wrapSelection('**','**')}>
			<strong>B</strong>
		</Button>
		<Button onClick={() => props.wrapSelection('*','*')}>
			<em>I</em>
		</Button>
		<Button onClick={() => props.wrapSelection('~~','~~')}>
			<strike>S</strike>
		</Button>
		<Button onClick={() => {
			let url = window.prompt();
			if (url !== null) props.wrapSelection('[',`](${url})`);
			else props.wrapSelection('', '');
		}}>
			<i className="fas fa-link"></i>
		</Button>
		<Button onClick={() => props.wrapSelection('`','`')}>
			&lt;&gt;
		</Button>

		<Button onClick={() => props.wrapSelection('[Spoiler](/s "','")')}>
			Spoiler
		</Button>

		<Popover hide={hidePopover} render={() => {
			const faces = list.filter(face => face.active).map(face => (
				<a
					className="add-face"
					onClick={() => {
						props.wrapSelection('[',`](#${face.name})`);
						toggleHidden(true);
					}}
					href="javascript:void(0)"
				>
					<img src={`active/${face.name}`} />
				</a>
			));

			return (
				null	
			);
		}}>
			<Button onClick={() => toggleHidden(!hidePopover)}>
				Face
			</Button>
		</Popover>
	</div>
};

/** Button for formatting bar. Should not be used outside this component **/
const Button = props => {
	return (
		<button
			className="formatting-button"
			onClick={props.onClick}
		>{props.children}</button>
	);
}

export default FormattingBar;
