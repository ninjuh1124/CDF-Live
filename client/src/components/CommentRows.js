import React, { useState, useContext } from 'react';
import TimeAgo from 'react-timeago';

import useEditor from '../hooks/useEditor';
import RedditContext from '../context';

import Markdown from './Markdown';
import Editor from './Editor';
import Source from './Source';
import RedditButton from './RedditButton';

import {
	deletePost,
	savePost,
	unsavePost,
	upvotePost } from '../utils/redditAPI';

const CommentAuthorRow = ({ comment, ...props }) => (
	<div className="author-row">
		<h5>
			<a
				href={comment.permalink}
				className="username"
				rel="noreferrer noopener"
				target="_blank"
			><strong>
				{comment.author}
			</strong></a>

			<span
				className="link-primary"
				style={{float: 'right'}}
				title={new Date(created*1000)}
			>
				<TimeAgo
					date={comment.created*1000}
					title={null}
				/>
			</span>
		</h5>
	</div>
);


const CommentBodyRow = ({ comment, ...props }) => (
	<div className="body-row">

		<div className="body">
			<Markdown
				source={comment.body}
			/>
		</div>
	</div>
);


const CommentButtonsRow = ({ comment, ...props }) => (
	<div className='reddit-buttons-row'>
		{(!comment.ownPost) &&
			<RedditButton
				onClick={() => {
					if (comment.upvoted) {
						upvote({
							accessToken: comment.accessToken,
							_id: comment._id,
							dir: 0
						})
							.then(res => { 
								comment.unvote();
							})
							.catch(error => { 
								comment.setError(error);
							});
					} else {
						upvote({
							accessToken: comment.accessToken,
							_id: comment._id,
							dir: 1
						})
							.then(res => { 
								comment.upvote(); 
							})
							.catch(error => { 
								comment.setError(error) 
							});
					}
				}}
				className={`reddit-button link-primary ${comment.upvoted ? ' upvoted' : ''}`
				}
			>
				<i className='fas fa-arrow-up'></i>
			</RedditButton>
		}

		<RedditButton
			onClick={() => setShowSource(!showSource)}
		>
			source
		</RedditButton>

		{comment.ownPost &&
			<RedditButton
				onClick={() => {
					deletePost({ accessToken, _id })
						.then(res => {
							comment.delete();
						})
						.catch(err => {
							comment.setError(err);
						});
				}}
			>
				delete
			</RedditButton>
		}

		{comment.accessToken &&
			<RedditButton
				onClick={ () => {
					if (comment.saved) {
						unsavePost({
							accessToken: comment.accessToken,
							_id: comment._id
						})
							.then(res => {
								comment.unsave();
							})
							.catch(err => {
								comment.setError(err);
							});
					} else {
						savePost({
							accessToken: comment.accessToken,
							_id: comment._id
						})
							.then(res => {
								comment.save();
							})
							.catch(err => {
								comment.setError(err);
							});
					}
				}}
			>
				{comment.saved ? 'unsave' : 'save'}
			</RedditButton>
		}

		<RedditButton
			onClick={ () => {
				if (comment.hidden) {
					comment.unhide();
				} else {
					comment.hide();
				}
			}}
		>
			{comment.hidden ? 'unhide' : 'hide'}
		</RedditButton>
		
		{ownPost &&
			<RedditButton
				onClick={() => {
					if (comment.editor.showEditor && 
						comment.editor.type === 'edit') {
						comment.editor.setShowEditor(false);
					} else {
						comment.editor.setText(comment.body);
						comment.editor.setType('edit');
						comment.editor.setShowEditor(true);
					}
				}}
			>
				edit
			</RedditButton>
		}

		{comment.user !== '' ||
			<RedditButton
				onClick={() => {
					if (comment.editor.showEditor && 
						comment.editor.type === 'reply') {
						comment.editor.setShowEditor(false);
					} else {
						comment.editor.setText(
							window.getSelection().toString()
						);
						comment.editor.setType('reply');
						comment.editor.setShowEditor(true);
					}
				}}
			>
				reply 
			</RedditButton>
		}

		{comment.error && <span className='error'>
			Error encountered: {comment.error}
		</span>}

		{comment.showSource &&
			<Source
				body={comment.body}
				close={() => { comment.setShowSource(false) }}
			/>
		}

		<Editor editor={comment.editor} />
	</div>
);


export { CommentAuthorRow,
		CommentBodyRow,
		CommentButtonsRow }
