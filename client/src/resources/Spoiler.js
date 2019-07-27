import React from 'react';

class Spoiler extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = { className: "spoiler" };
//		this.onClick = this.onClick.bind(this);
	}
	
	// TODO: figure out why state resets when new comments are loaded in
	onClick() {
		this.setState(oldState => {
			return { className: oldState.className === "spoiler"
			? "spoiler-revealed"
			: "spoiler" };
		});
	}

	render() {
		return (
			<span 
				className={this.state.className} 
//				onClick={this.onClick}
			>
				{this.props.outerText}
				<span className="spoiler-inner">
					{this.props.innerText}
				</span>
			</span>
		)
	}

}

export default Spoiler;
