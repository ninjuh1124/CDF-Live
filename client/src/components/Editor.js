import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import renderers from '../resources/renderers';
import FormattingBar from './FormattingBar';
import axios from 'axios';
import querystring from 'querystring';

const Editor = props => {
	const [isSending, startSending] = useState(false);
	const [text, changeText] = useState('');
	const textAreaRef = useRef();

	const focusTextArea = () => textAreaRef.current.focus(); 
	const handleChange = e => changeText(e.target.value);

	/**
	 * Thanks RES
	 * TODO move to container
	 **/
	const wrapSelection = (prefix, suffix) => {
		let box = textAreaRef.current;

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

		changeText(beforeSelection+prefix+selectedText+suffix+trailingSpace+afterSelection);
		
		box.selectionEnd = beforeSelection.length+prefix.length+selectedText.length;
		if (selectionStart === selectionEnd) {
			box.selectionStart = box.selectionEnd;
		} else {
			box.selectionStart = beforeSelection.length + prefix.length;
		}

		box.scrollTop = scrollTop;
		focusTextArea();
	}

	/**
	 * DOUBLE HANDLER FOR REPLIES AND EDITS
	 * TODO move to container
	 **/
	const submit = e => {
		if (!text.trim()) return;

		let uri;
		if (props.editorMode === 'reply')
			uri = "https://oauth.reddit.com/api/comment";
		else if (props.editorMode === 'edit')
			uri = "https://oauth.reddit.com/api/editusertext";

		startSending(true);

		axios({
			method: 'post',
			headers: { 
				Authorization: 'Bearer ' + props.accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: uri,
			data: querystring.encode({
				text: text,
				api_type: 'json',
				thing_id: props._id
			})
		}).then(res => {
			if (props.editorMode === 'edit') {
				props.editFeed({
					_id: props._id,
					body: text
				});
				axios({
					method: 'post',
					url: process.env.REACT_APP_API + 'v1/edit',
					data: {
						token: props.accessToken,
						_id: props._id,
						id: props.id,
						body: text
					}
				}).then(res => {
					if (res.data.message === 'success') {
						props.editFeed({
							_id: props._id,
							id: props.id,
							body: text
						});
					}
					props.toggleEditor(props.editorMode);
				});
			} else if (props.editorMode === 'reply') {
				let data = res.data.json.data.things[0].data;
				props.prependToFeed([
					{
						kind: 'comment',
						author: data.author,
						_id: data.name,
						id: data.id,
						thread: data.link_id,
						created: data.created_utc,
						permalink: 'https://reddit.com'+data.permalink,
						parentID: data.parent_id,
						body: text
					}
				]);
				props.toggleEditor(props.editorMode);
			}
		}).catch(err => {
			console.log(err);
			startSending(false);
		});
	}

	const cancel = e => {
		props.toggleEditor(props.editorMode);
		e.preventDefault();
	}

	/**
	 * On initial render, quote in highlighted text
	 **/
	useEffect( () => {
		let selection = window.getSelection().toString();
		if (props.editorMode === 'edit') {
			changeText(props.body);
			focusTextArea();
		} else if (props.editorMode === 'reply') {
			focusTextArea();
			if (window.getSelection) {
				changeText(selection ? selection
					.replace(/^.*/gm, t => '>'+t)
					.replace(/^>$/gm, t => '') + '\n\n'	: ''				
				);
			}
		}
	}, []);
	
	return (
		<div>
			{text.trim() === '' ||
				<div 
					className="comment preview"
					style={{ float: 'none', marginBottom: '5px' }}
				>

					<p className="author-row">
						<strong>Preview</strong>
					</p>

					<span className="body-row">
						<ReactMarkdown
							source={text}
							disallowedTypes={[
								'imageReference',
								'linkReference'
							]}
							unwrapDisallowed={true}
							plugins={[require('../resources/supPlugin')]}
							parserOptions={{ 
								commonmark: true, 
								pedantic: true
							}}
							renderers={renderers}
						/>
					</span>

				<br />
				</div>
			}

			<FormattingBar wrapSelection={wrapSelection} />

			<form onSubmit={submit}>
				<textarea 
					className='editor-box'
					ref={textAreaRef}
					rows='6'
					cols='50'
					onChange={handleChange}
					value={text}
					disabled={isSending}
				/>

				<br />

				<button
					className="form-button"
					type="submit"
					disabled={isSending}
				>
					{props.editorMode}
				</button>
				<button
					className="form-button"
					onClick={cancel}
					type="button"
					disabled={isSending}
				>
					cancel
				</button>
			</form>
		</div>
	);
}


export default Editor;
