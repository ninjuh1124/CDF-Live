import React from 'react'
import Editor from './Editor';
import CommentHandler from './CommentHandler';
import Author from './Author';
import TimeAgo from 'react-timeago';

const CommentAuthorRow = (props) => {
	return (
		<div className="author-row row">
			<div className="col-xs-11">
				<h5>
					<Author {...props} />
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
		<div className="body-row row">
			<div className="col-xs-11">
				<CommentHandler body={props.body} />
			</div>
			<div className="col-xs-1">
				<a
					href={props.permalink}
					target="_blank"
					rel="noopener noreferrer"
				>
					<h2
						className="arrow-link text-center"
					>
						<i
							className="fa fa-angle-right"
						/>
						</h2>
				</a>
			</div>
		</div>
	);
}

class CommentButtonsRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editorMode: 'hidden'
		};
		this.toggleEditor = this.toggleEditor.bind(this);
	}

	toggleEditor(mode) {
		this.setState(state => {
			return {
				editorMode: (mode == state.editorMode
							? 'hidden'
							: mode)
			};
		});
	}

	render() {
		return (
			<div>
				<a
					href='javascript:void(0)'
					className='link-primary'
					onClick={ () => this.toggleEditor('reply')}
				>
					reply 
				</a>
				&nbsp;
				{this.props.author === sessionStorage.getItem('name')
				? <a
					href='javascript:void(0)'
					className='link-primary'
					onClick={ () => this.toggleEditor('edit')}
				>
					edit
				</a>
				: null}

				{
					this.state.editorMode != 'hidden'
					? <Editor 
						editorMode={this.state.editorMode}
						toggleEditor={this.toggleEditor}
						{...this.props}
					/>
					: null
				}
			</div>
		);
	}
}

export {CommentAuthorRow,
		CommentBodyRow,
		CommentButtonsRow}
