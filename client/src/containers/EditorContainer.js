import React, { useState, useRef, useContext, useEffect } from 'react';
import Editor from '../components/Editor';

import { CommentContext } from '../components/Comment';

import axios from 'axios';
import querystring from 'querystring';

const EditorContainer = props => {
	const [isSending, startSending] = useState(false);
	const [text, changeText] = useState('');
	const textAreaRef = useRef();
	const {
		_id, id, accessToken, editFeed, prependToFeed
	} = useContext(CommentContext);

	const focusTextArea = () => textAreaRef.current.focus();
	const handleChange = e => changeText(e.target.value);

	/**
	 * Thanks RES
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
				Authorization: 'Bearer ' + accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: uri,
			data: querystring.encode({
				text: text,
				api_type: 'json',
				thing_id: _id
			})
		}).then(res => {
			if (props.editorMode === 'edit') {
				editFeed({
					_id: _id,
					body: text
				});
				axios({
					method: 'post',
					url: process.env.REACT_APP_API + 'v1/edit',
					data: {
						token: accessToken,
						_id: _id,
						id: id,
						body: text
					}
				}).then(res => {
					if (res.data.message === 'success') {
						editFeed({
							_id: _id,
							id: id,
							body: text
						});
					}
					props.toggleEditor(props.editorMode);
				});
			} else if (props.editorMode === 'reply') {
				let data = res.data.json.data.things[0].data;
				prependToFeed([
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

		e.preventDefault();
	}

	/**
	 * Close text box, send nothing
	 **/
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
	}, [props.editorMode]);

	return props.editorMode === 'hidden' || (
		<Editor
			editorMode={props.editorMode}
			text={text}
			handleChange={handleChange}
			isSending={isSending}
			textAreaRef={textAreaRef}
			focusTextArea={focusTextArea}
			wrapSelection={wrapSelection}
			submit={submit}
			cancel={cancel}
		/>
	);
};

export default EditorContainer;
