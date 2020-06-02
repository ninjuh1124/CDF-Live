import { useState, useRef, useContext, useEffect } from 'react';

import { FeedContext, RedditContext } from '../context';

import makeWrapSelection from '../utils/makeWrapSelection';
import { commentPost, editPost } from '../utils/redditAPI';

const useEditor = ({ _id, defaultText, defaultType }) => {
	const [type, setType] = useState(defaultType || null);

	/** CONTEXTS **/
	const feed = useContext(FeedContext);
	const reddit = useContext(RedditContext);

	/** TEXT AREA **/
	const [text, setText] = useState(defaultText || '');
	const [showEditor, setShowEditor] = useState(false);
	const textAreaRef = useRef({ value: null });
	const focusTextArea = () => textAreaRef.current.focus();
	// may have to useEffect to keep wrapSelection ref up to date
	const wrapSelection = makeWrapSelection(textAreaRef.current);
	useEffect(() => { /** UPDATE STATE ALONGSIDE TEXT AREA **/
		if (textAreaRef.current) {
			setText(textAreaRef.current.value);
		}
	}, [textAreaRef.current.value]);

	/** API CALLS **/
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState(null);
	const submit = e => {
		if (!text.trim()) {
			setError(new Error('No input'));
			return;
		}
		
		setIsSending(true);
		if (type === 'reply') { /** REPLY TO COMMENT/FEED **/
			commentPost({
				accessToken: reddit.accessToken,
				parent_id: _id,
				body: text.trim()
			})
				.then(res => {
					setShowEditor(false);
					feed.historyDispatch({
						type: 'prepend',
						comments: [{
							kind: 'comment',
							author: res.author,
							_id: res.name,
							id: res.id,
							thread: res.link_id,
							created: res.created_utc,
							permalink: `https://reddit.com${res.permalink}`,
							parentID: res.parent_id,
							body: text
						}]
					});
					setError(null);
				})
				.catch(err => {
					setError(err);
				})
				.finally(() => {
					setIsSending(false);
				});
		} else if (type === 'edit') { /** UPDATE FEED **/
			editPost({
				accessToken: reddit.accessToken,
				_id,
				body: text.trim()
			})
				.then(res => {
					setShowEditor(false);
					try {
						feed.historyDispatch({ 
							_id, type: 'edit', body: text.trim() 
						});
					} catch (err) {
						setError(err);
					}
				})
				.catch(err => {
					setError(err);
				})
				.finally(() => {
					setIsSending(false);
				});
	}

	return {
		text, textAreaRef, type, setType,
		showEditor, setShowEditor, 
		focusTextArea, wrapSelection,
		submit, isSending, error
	};
}}

export default useEditor;
