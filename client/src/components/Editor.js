import React from 'react';
import ReactMarkdown from 'react-markdown';
import renderers from '../resources/renderers';
import FormattingBar from './FormattingBar';
import axios from 'axios';
import querystring from 'querystring';

class Editor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isSending: false,
			text: ''
		};
		this.textAreaRef = React.createRef();

		this.wrapSelection = this.wrapSelection.bind(this);
		this.focusTextArea = this.focusTextArea.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.submit = this.submit.bind(this);
		this.cancel = this.cancel.bind(this);
	}

	focusTextArea() {
		this.textAreaRef.current.focus();
	}

	// shameless theft from RES
	wrapSelection(prefix, suffix) {
		let box = this.textAreaRef.current;

		if (!box) {
			return;
		}
		// record scroll top to restore it later.
		const scrollTop = box.scrollTop;

		// We will restore the selection later, so record the current selection.
		const selectionStart = box.selectionStart;
		const selectionEnd = box.selectionEnd;

		const text = box.value;
		const beforeSelection = text.substring(0, selectionStart);
		let selectedText = text.substring(selectionStart, selectionEnd);
		const afterSelection = text.substring(selectionEnd);

		// Markdown doesn't like it when you tag a word like **this **. The space messes it up. So we'll account for that because Firefox selects the word, and the followign space when you double click a word.
		let trailingSpace = '';
		let cursor = selectedText.length - 1;
		while (cursor > 0 && selectedText[cursor] === ' ') {
			trailingSpace += ' ';
			cursor--;
		}
		selectedText = selectedText.substring(0, cursor + 1);
	
		this.setState({ 
				text: beforeSelection+prefix+selectedText+suffix+
					trailingSpace+afterSelection
		}, () => {
			box.selectionEnd = beforeSelection.length + prefix.length + 
				selectedText.length;
			if (selectionStart === selectionEnd) {
				box.selectionStart = box.selectionEnd;
			} else {
				box.selectionStart = beforeSelection.length + prefix.length;
			}

			box.scrollTop = scrollTop;
			this.focusTextArea();
		});
	}

	handleChange(e) {
		this.setState({text: e.target.value});
	}

	submit(e) {
		if (!this.state.text.trim()) return;

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
						url: process.env.REACT_APP_API + 'v1/edit',
						data: {
							token: this.props.accessToken,
							_id: this.props._id,
							id: this.props.id,
							body: this.state.text
						}
					}).then(res => {
						if (res.data.message === 'success') {
							this.props.editFeed({
								_id: this.props._id,
								id: this.props.id,
								body: this.state.text
							});
						}
						this.props.toggleEditor(this.props.editorMode);
					});
				} else if (this.props.editorMode === 'reply') {
					let data = res.data.json.data.things[0].data;
					this.props.prependToFeed([
						{
							kind: 'comment',
							author: data.author,
							_id: data.name,
							id: data.id,
							thread: data.link_id,
							created: data.created_utc,
							permalink: 'https://reddit.com'+data.permalink,
							parentID: data.parent_id,
							body: data.body
						}
					]);
					this.props.toggleEditor(this.props.editorMode);
				}
			}).catch(err => {
				console.log(err);
				this.setState({ isSending: false });
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
			this.focusTextArea();
		} else if (this.props.editorMode === 'reply') {
			this.focusTextArea();
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
				{this.state.text.trim() === '' ||
					<div 
						className="col-xs-11 list-group-item comment preview"
						style={{ float: 'none', marginBottom: '5px' }}
					>
						<p><strong>Preview</strong></p>
						<span className="body-row">
							<ReactMarkdown
								source={this.state.text}
								disallowedTypes={['imageReference', 'linkReference']}
								plugins={[require('../resources/supPlugin')]}
								renderers={renderers}
							/>
						</span>
					<br />
					</div>
				}

				<FormattingBar wrapSelection={this.wrapSelection} />

				<form onSubmit={this.submit}>
					<textarea 
						className='editor-box'
						ref={this.textAreaRef}
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
