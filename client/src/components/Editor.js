import React from 'react';
import axios from 'axios';
import CommentHandler from './CommentHandler';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.submit = this.submit.bind(this);
		this.cancel = this.cancel.bind(this);
	}

	handleChange(e) {
		this.setState({text: e.target.value});
	}

	submit(e) {
		let uri;
		if (this.props.editorMode === 'reply')
			uri = "https://oauth.reddit.com/api/comment";
		else if (this.props.editorMode === 'edit')
			uri = "https://oauth.reddit.com/api/editusertext";

		axios.post(uri,
			{
				text: this.state.text,
				thing_id: this.props._id
			}
		);
		e.preventDefault();
	}

	cancel(e) {
		this.props.toggleEditor(this.props.editorMode);
		e.preventDefault();
	}

	render() {
		return (
			<div>
				{
					this.state.text === ''
					? null
					: <div className="col-xs-11 list-group-item comment preview">
						<p><strong>Preview</strong></p>
						<span className="body-row">
							<CommentHandler body={this.state.text} />
						</span>
					</div>
				}

				<form>
					<textarea 
						className='editor-box'
						rows='6'
						cols='100'
						onChange={this.handleChange}
						value={this.state.text}
					/>

					<br />

					<button
						className="form-button"
						type="submit"
					>
						{this.props.editorMode}
					</button>
					<button
						className="form-button"
						onClick={this.cancel}
						type="button"
					>
						cancel
					</button>
				</form>
			</div>
		);
	}
}

export default Editor;
