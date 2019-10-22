import React from 'react';
import axios from 'axios';
import querystring from 'querystring';
import Editor from './Editor';
import Source from './Source';
import TimeAgo from 'react-timeago';
import ReactMarkdown from 'react-markdown';
import renderers from '../resources/renderers';

const CommentAuthorRow = (props) => {
	return (
		<div className="author-row">
			<div className="col-xs-11">
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

class CommentButtonsRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			source: 'hidden',
			editorMode: 'hidden'
		};
		this.toggleEditor = this.toggleEditor.bind(this);
		this.deletePost = this.deletePost.bind(this);
		this.save = this.save.bind(this);
		this.hide = this.hide.bind(this);
		this.upvote = this.upvote.bind(this);
		this.toggleSource = this.toggleSource.bind(this);
	}

	toggleSource() {
		this.setState(oldState => ({
			source: (oldState.source === 'hidden' ? 'visible' : 'hidden')
		}));
	}

	deletePost() {
		axios({
			method: 'post',
			url: 'https://oauth.reddit.com/api/del',
			headers: {
				Authorization: 'Bearer ' + this.props.accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: this.props._id
			})
		}).then(res => {
			axios({
				method: 'post',
				url: process.env.REACT_APP_API + 'v1/delete',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data: querystring.encode({
					token: this.props.accessToken,
					id: this.props.id,
					_id: this.props._id
				})
			}).then(res => {
				if (res.data.message === 'success') {
					this.props.deleteFromFeed(this.props._id);
				}
			});
		});
	}

	save() {
		axios({
			method: 'post',
			url: (this.props.isSaved ? 
				'https://oauth.reddit.com/api/unsave' :
				'https://oauth.reddit.com/api/save'),
			headers: {
				Authorization: 'Bearer ' +
					this.props.accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: this.props._id
			})
		}).then(res => {
			this.props.save();
		});
	}

	hide() {
		this.props.hide();
	}

	upvote() {
		axios({
			method: 'post',
			url: 'https://oauth.reddit.com/api/vote',
			headers: {
				Authorization: 'Bearer ' + this.props.accessToken,
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				id: this.props._id,
				dir: (this.props.upvoted ? 0 : 1)
			})
		}).then(res => {
			this.props.upvote();
		}).catch(err => console.log(err));
	}

	toggleEditor(mode) {
		this.setState(state => {
			return {
				editorMode: (mode === state.editorMode
							? 'hidden'
							: mode)
			};
		});
	}

	render() {
		return (
			<div>
				{this.props.ownPost ||
					<a
						href='javascript:void(0)'
						className={'reddit-button link-primary' + 
							(this.props.isUpvoted ? ' upvoted' : '')
						}
						onClick={ () => this.upvote()}
					>
						<i className='fas fa-arrow-up'></i>
					</a>
				}

				<a
					href='javascript:void(0)'
					className='reddit-button link-primary'
					onClick={() => this.toggleSource()}
				>
					source
				</a>

				{this.props.ownPost &&
					<a
						href='javascript:void(0)'
						className='link-primary reddit-button'
						onClick={ () => this.deletePost()}
					>
						delete
					</a>
				}

				<a
					href='javascript:void(0)'
					className='link-primary reddit-button'
					onClick={ () => this.save()}
				>
					{this.props.isSaved ? 'unsave' : 'save'}
				</a>

				<a
					href='javascript:void(0)'
					className='link-primary reddit-button'
					onClick={ () => this.hide()}
				>
					{this.props.isHidden ? 'unhide' : 'hide'}
				</a>
				
				{this.props.ownPost &&
					<a
						href='javascript:void(0)'
						className='link-primary reddit-button'
						onClick={ () => this.toggleEditor('edit')}
					>
						edit
					</a>
				}

				<a
					href='javascript:void(0)'
					className='link-primary reddit-button'
					onClick={ () => this.toggleEditor('reply')}
				>
					reply 
				</a>

				{this.state.source !== 'hidden' &&
					<Source
						body={this.props.body}
						close={this.toggleSource}
					/>
				}

				{this.state.editorMode !== 'hidden' &&
					<Editor 
						editorMode={this.state.editorMode}
						toggleEditor={this.toggleEditor}
						editPost={this.editPost}
						deletePost={this.deletePost}
						{...this.props}
					/>
				}
			</div>
		);
	}
}

export { CommentAuthorRow,
		CommentBodyRow,
		CommentButtonsRow }
