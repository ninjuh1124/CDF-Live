import React from 'react';

const Source = props => (
	<div>
		<textarea
			className='editor-box'
			rows='6'
			cols='50'
			value={props.body}
			disabled={true}
		/>
		<br />
		<button
			className="form-button"
			type="button"
			onClick={props.close}
		>
			close
		</button>
	</div>
)

export default Source;
