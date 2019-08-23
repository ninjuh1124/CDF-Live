import React from 'react';

const FormattingBar = props => {
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
		<Button onClick={() => props.wrapSelection('[',']()')}>
			<i className="fas fa-link"></i>
		</Button>
		<Button onClick={() => props.wrapSelection('`','`')}>
			&lt;&gt;
		</Button>

		<Button onClick={() => props.wrapSelection('[Spoiler](/s "','")')}>
			Spoiler
		</Button>
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
