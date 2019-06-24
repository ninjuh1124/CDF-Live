import React from 'react';
import Editor from './Editor';

class Buttons extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showEditor: false,
			type: null
		};
	}

	render() {
		return (
			<div>
				<a onClick={this.props.toggleEditor()}>reply</a>
			</div>
		);
	}
}

export default Buttons;
