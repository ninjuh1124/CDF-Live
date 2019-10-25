import React, { useState, useEffect } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import Editor from './Editor';
import Source from './Source';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';
import renderers from '../resources/renderers';
import RedditButton from '../resources/RedditButton';

const CommentAuthorRow = (props) => {
	return (
		<div className="author-row">
			<h5>
				<a
					href={props.permalink}
					className="username"
					rel="noreferrer noopener"
					target="_blank"
				><strong>
					{props.author}
				</strong></a>

				<span
					className="link-primary"
					style={{float: 'right'}}
					title={new Date(props.created*1000)}
				>
					<TimeAgo
						date={props.created*1000}
						title={null}
					/>
				</span>
			</h5>
		</div>
	);
}

const CommentBodyRow = (props) => {
	return (
		<div className="body-row">

			<div className="body">
				<ReactMarkdown
					source={props.body.replace(/^#{1,}/gm, '$& ')}
					disallowedTypes={['imageReference', 'linkReference']}
					unwrapDisallowed={true}
					plugins={[require('../resources/supPlugin')]}
					parserOptions={{ commonmark: true, pedantic: true }}
					renderers={renderers}
				/>
			</div>
		</div>
	);
}

const CommentButtonsRow = props => {
	const [source, toggleSource] = useState('hidden');
	const [editorMode, toggleEditor] = useState('hidden');

	const deletePost = () => {
		axios({
			method: 'post',
			url: 'https://oauth.reddit.com/api/del',
			headers: {
				Authorization: 'Bearer ' + props.accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: props._id
			})
		}).then(res => {
			axios({
				method: 'post',
				url: process.env.REACT_APP_API + 'v1/delete',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: querystring.encode({
					token: props.accessToken,
					id: props.id,
					_id: props._id
				})
			}).then(res => {
				if (res.data.message === 'success') {
					props.deleteFromFeed(props._id);
				}
			});
		});
	}

	const save = () => {
		axios({
			method: 'post',
			url: (props.isSaved ? 
				'https://oauth.reddit.com/api/unsave' :
				'https://oauth.reddit.com/api/save'),
			headers: {
				Authorization: 'Bearer ' +
					props.accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: props._id
			})
		}).then(res => {
			props.save();
		});
	}

	const upvote = () => {
		axios({
			method: 'post',
			url: 'https://oauth.reddit.com/api/vote',
			headers: {
				Authorization: 'Bearer ' + props.accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: props._id,
				dir: (props.upvoted ? 0 : 1)
			})
		}).then(res => {
			props.upvote();
		}).catch(err => console.log(err));
	}

	return (
		<div className="reddit-buttons-row">
			{props.ownPost ||
				<RedditButton
					onClick={() => upvote()}
					className={'reddit-button link-primary' + 
						(props.isUpvoted ? ' upvoted' : '')
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

			{props.ownPost &&
				<RedditButton
					onClick={ () => deletePost()}
				>
					delete
				</RedditButton>
			}

			<RedditButton
				onClick={ () => save()}
			>
				{props.isSaved ? 'unsave' : 'save'}
			</RedditButton>

			<RedditButton
				onClick={ () => props.hide()}
			>
				{props.isHidden ? 'unhide' : 'hide'}
			</RedditButton>
			
			{props.ownPost &&
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
					body={props.body}
					close={() => toggleSource()}
				/>
			}

			{editorMode !== 'hidden' &&
				<Editor 
					editorMode={editorMode}
					toggleEditor={() => toggleEditor('hidden')}
					deletePost={deletePost}
					{...props}
				/>
			}
		</div>
	);
}

export { CommentAuthorRow,
		CommentBodyRow,
		CommentButtonsRow }
