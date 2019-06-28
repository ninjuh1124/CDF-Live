import React from 'react';
import axios from 'axios';
import querystring from 'querystring';
import CommentHandler from './CommentHandler';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSending: false,
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

		this.setState({ isSending: true }, () => {
			axios({
				method: 'post',
				headers: { 
					Authorization: 'Bearer ' + 
						sessionStorage.getItem('accessToken'),
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				url: uri,
				data: querystring.encode({
					text: this.state.text,
					api_type: 'json',
					thing_id: this.props.id
				})
			}).then(res => {
				console.log(res);
				this.props.toggleEditor(this.props.editorMode);
			}).catch(err => {
				console.log(err);
			});
		});
		e.preventDefault();
	}

	cancel(e) {
		this.props.toggleEditor(this.props.editorMode);
		e.preventDefault();
	}

	componentDidMount() {
		if (this.props.editorMode === 'edit') {
			this.setState({ text: this.props.body });
		} else if (this.props.editorMode === 'reply') {
			if (window.getSelection) {
				this.setState({ text: window.getSelection()
					.toString()
					.replace(/^.*/gm, t => '>'+t)
					.replace(/^>$/gm, t => '')
				});
			}
		}
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

				<form onSubmit={this.submit}>
					<textarea 
						className='editor-box'
						rows='6'
						cols='100'
						onChange={this.handleChange}
						value={this.state.text}
						disabled={this.state.isSending}
					/>

					<br />

					<button
						className="form-button"
						type="submit"
						disabled={this.state.isSending}
					>
						{this.props.editorMode}
					</button>
					<button
						className="form-button"
						onClick={this.cancel}
						type="button"
						disabled={this.state.isSending}
					>
						cancel
					</button>
				</form>
			</div>
		);
	}
}

export default Editor;
