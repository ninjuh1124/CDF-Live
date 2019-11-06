import React, { useState, useContext } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { CommentContext } from './Comment';
import Markdown from './Markdown';
import EditorContainer from '../containers/EditorContainer';
import Source from './Source';
import TimeAgo from 'react-timeago';
import RedditButton from '../resources/RedditButton';

const CommentAuthorRow = () => {
	const { permalink, author, created } = useContext(CommentContext);

	return (
		<div className="author-row">
			<h5>
				<a
					href={permalink}
					className="username"
					rel="noreferrer noopener"
					target="_blank"
				><strong>
					{author}
				</strong></a>

				<span
					className="link-primary"
					style={{float: 'right'}}
					title={new Date(created*1000)}
				>
					<TimeAgo
						date={created*1000}
						title={null}
					/>
				</span>
			</h5>
		</div>
	);
}

const CommentBodyRow = () => {
	const { body } = useContext(CommentContext);

	return (
		<div className="body-row">

			<div className="body">
				<Markdown
					source={body}
				/>
			</div>
		</div>
	);
}

const CommentButtonsRow = () => {
	const [source, toggleSource] = useState('hidden');
	const [editorMode, toggleEditor] = useState('hidden');

	const { 
		_id, id, ownPost, upvoted, body, accessToken, isUpvoted, 
		isSaved, isHidden, deleteFromFeed, upvote, hide, save 
	} = useContext(CommentContext);

	const deletePost = () => {
		axios({
			method: 'post',
			url: 'https://oauth.reddit.com/api/del',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: _id
			})
		}).then(res => {
			axios({
				method: 'post',
				url: `${process.env.REACT_APP_API}v1/delete`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: querystring.encode({
					token: accessToken,
					id: id,
					_id: _id
				})
			}).then(res => {
				if (res.data.message === 'success') {
					deleteFromFeed(_id);
				}
			});
		});
	}

	const saveComment = () => {
		axios({
			method: 'post',
			url: (isSaved ? 
				'https://oauth.reddit.com/api/unsave' :
				'https://oauth.reddit.com/api/save'),
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: _id
			})
		}).then(res => {
			save();
		});
	}

	const upvoteComment = () => {
		axios({
			method: 'post',
			url: 'https://oauth.reddit.com/api/vote',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: _id,
				dir: (upvoted ? 0 : 1)
			})
		}).then(res => {
			upvote();
		}).catch(err => console.log(err));
	}

	return (
		<div className="reddit-buttons-row">
			{ownPost ||
				<RedditButton
					onClick={() => upvoteComment()}
					className={`reddit-button link-primary ${isUpvoted ? ' upvoted' : ''}`
					}
				>
					<i className='fas fa-arrow-up'></i>
				</RedditButton>
			}

			<RedditButton
				onClick={() => toggleSource(source === 'hidden' ?
					'visible' : 
					'hidden'
				)}
			>
				source
			</RedditButton>

			{ownPost &&
				<RedditButton
					onClick={ () => deletePost()}
				>
					delete
				</RedditButton>
			}

			<RedditButton
				onClick={ () => saveComment()}
			>
				{isSaved ? 'unsave' : 'save'}
			</RedditButton>

			<RedditButton
				onClick={ () => hide()}
			>
				{isHidden ? 'unhide' : 'hide'}
			</RedditButton>
			
			{ownPost &&
				<RedditButton
					onClick={ () => toggleEditor(editorMode === 'hidden' ?
						'edit' : 'reply')}
				>
					edit
				</RedditButton>
			}

			<RedditButton
				onClick={ () => toggleEditor(editorMode === 'hidden' ?
					'reply' : 'hidden')}
			>
				reply 
			</RedditButton>

			{source !== 'hidden' &&
				<Source
					body={body}
					close={() => toggleSource('hidden')}
				/>
			}

			<EditorContainer 
				editorMode={editorMode}
				toggleEditor={() => toggleEditor('hidden')}
			/>
		</div>
	);
}

export { CommentAuthorRow,
		CommentBodyRow,
		CommentButtonsRow }
