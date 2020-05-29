import React from 'react';
import Markdown from './Markdown';
import FormattingBar from './FormattingBar';

const Editor = ({ editor, ...props }) => (
	<div>
		{editor.text.trim() === '' ||
			<div 
				className='comment preview'
				style={{ float: 'none', marginBottom: '5px' }}
			>

				<p className='author-row'>
					<strong>Preview</strong>
				</p>

				<span className='body-row'>
					<Markdown
						source={editor.text}
					/>
				</span>

			<br />
			</div>
		}

		<FormattingBar wrapSelection={editor.wrapSelection} />

		<form onSubmit={editor.submit}>
			<textarea 
				className='editor-box'
				ref={editor.textAreaRef}
				rows='6'
				cols='50'
				disabled={editor.isSending}
			/>

			<br />

			<button
				className='form-button'
				type='submit'
				disabled={editor.isSending}
			>
				{editor.type}
			</button>
			<button
				className='form-button'
				onClick={() => { editor.setShowEditor(false); }}
				type='button'
				disabled={editor.isSending}
			>
				cancel
			</button>

			{editor.error && <span className='error'>
				Error {editor.error}
			</span>}
		</form>
	</div>
);

export default Editor;
