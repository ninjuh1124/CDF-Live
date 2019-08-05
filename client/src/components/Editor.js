import React from 'react';
import ReactMarkdown from 'react-markdown';
import renderers from '../resources/renderers';
import axios from 'axios';
import querystring from 'querystring';

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
					Authorization: 'Bearer ' + this.props.accessToken,
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				url: uri,
				data: querystring.encode({
					text: this.state.text,
					api_type: 'json',
					thing_id: this.props._id
				})
			}).then(res => {
				if (this.props.editorMode === 'edit') {
					this.props.editFeed({
						_id: this.props._id,
						body: this.state.text
					});
					axios({
						method: 'post',
						url: process.env.REACT_APP_API + 'edit',
						data: {
							_id: this.props._id,
							id: this.props.id,
							body: this.state.text
						}
					}).then(res => {
						if (res.data.message === 'success') {
							this.props.editFeed({
								_id: this.props._id,
								body: this.state.text
							});
						}
						this.props.toggleEditor(this.props.editorMode);
					});
				} else {
					this.props.toggleEditor(this.props.editorMode);
				}
			}).catch(err => {
				console.log(err);
				this.props.toggleEditor(this.props.editorMode);
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
				{this.state.text === '' ||
					<div className="col-xs-11 list-group-item comment preview">
						<p><strong>Preview</strong></p>
						<span className="body-row">
							<ReactMarkdown
								source={this.state.text}
								disallowedTypes={['imageReference', 'linkReference']}
								renderers={renderers}
							/>
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
