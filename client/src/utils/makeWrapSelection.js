const makeWrapSelection = box => (prefix, suffix) => {
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

	box.value = (beforeSelection+prefix+selectedText+suffix+trailingSpace+afterSelection);
	
	box.selectionEnd = beforeSelection.length+prefix.length+selectedText.length;
	if (selectionStart === selectionEnd) {
		box.selectionStart = box.selectionEnd;
	} else {
		box.selectionStart = beforeSelection.length + prefix.length;
	}

	box.scrollTop = scrollTop;
	box.focus();
}

export default makeWrapSelection;
