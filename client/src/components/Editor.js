import React from 'react';
import Markdown from './Markdown';
import FormattingBar from './FormattingBar';

const Editor = ({
	text, isSending, editorMode, textAreaRef, focusTextArea,
	wrapSelection, handleChange, submit, cancel
}) => {
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
						<Markdown
							source={text}
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
					{editorMode}
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
