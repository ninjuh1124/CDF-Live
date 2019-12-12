import React, { useState, useContext } from 'react';
import { CommentContext } from './Comment';

import TimeAgo from 'react-timeago';

import Markdown from './Markdown';
import EditorContainer from '../containers/EditorContainer';

import RedditButton from '../resources/RedditButton';
import Source from './Source';

import {
	deletePost,
	savePost,
	unsavePost,
	upvotePost } from '../resources/redditAPI';
import { deleteComment } from '../resources/appAPI';

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
		_id, id, ownPost, upvoted, body, accessToken, isUpvoted, setError,
		isSaved, isHidden, deleteFromFeed, upvote, hide, save, loggedInAs 
	} = useContext(CommentContext);

	return (
		<div className="reddit-buttons-row">
			{(ownPost || loggedInAs !== "") ||
				<RedditButton
					onClick={() => {
						upvote();
						upvotePost({ accessToken, _id, upvoted });
					}}
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
					onClick={ () => {
						deletePost({ accessToken, id, _id })
							.catch(err => {
								console.log(err);
								setError(err);
							});
						deleteComment({ accessToken, _id })
							.catch(err => {
								console.log(err);
								setError(err);
							});
						deleteFromFeed(_id);
					}}
				>
					delete
				</RedditButton>
			}

			{loggedInAs !== "" ||
				<RedditButton
					onClick={ () => {
						isSaved ? 
							unsavePost({ accessToken, _id }) :
							savePost({ accessToken, _id });
						save(_id);
					}}
				>
					{isSaved ? 'unsave' : 'save'}
				</RedditButton>
			}

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

			{loggedInAs !== "" ||
				<RedditButton
					onClick={ () => toggleEditor(editorMode === 'hidden' ?
						'reply' : 'hidden')}
				>
					reply 
				</RedditButton>
			}

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
