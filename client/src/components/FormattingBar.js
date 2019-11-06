import React, { useState } from 'react';
import Popover from './Popver';

import { list } from '../resources/facecodes';

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

		/** TODO: finish this
		 * reference: https://codepen.io/mihaeltomic/pen/PqxVaq
		<Popover hide={hidePopover} render={() => {
			const faces = list.filter(face => face.active).map(face => {
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
			});

			return (
				
			);
		}>
			<Button onClick={() => toggleHidden(!hide)}>
				Face
			</Button>
		</Popover>
		**/
	</div>
};

const Button = props => {
	return (
		<button
			className="formatting-button"
			onClick={props.onClick}
		>{props.children}</button>
	);
}

export default FormattingBar;
