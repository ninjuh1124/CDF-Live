import React, { Component } from 'react';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			error: null,
			errorInfo: null
		};
	}


	componentDidCatch(error, errorInfo) {
		this.setState({ 
			error: error, 
			errorInfo: errorInfo 
		});
	}

	render() {
		if (this.state.errorInfo) {
			return (<>
				<h1 className='error'>Critical error encountered</h1>
				<details>
					{this.state.error && this.state.error.toString()}
					<br />
					{this.state.errorInfo.componentStack}
				</details>
			</>);
		}

		return this.props.children;
	}
};

export default ErrorBoundary;
