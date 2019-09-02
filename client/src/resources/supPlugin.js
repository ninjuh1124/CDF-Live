/**
 * based on zestedesavoir's remark-sub-super: https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-sub-super
 **/

const MARKER = '^';

function locator(value, fromIndex) {
	let index = -1;
	let found = [];

	index = value.indexOf(MARKER, fromIndex);
	if (index !== -1) found.push(index);

	if (found.length) {
		found.sort((a,b) => a-b);
		return found[0];
	}

	return -1;
}

function inlinePlugin() {
	function inlineTokenizer(eat, value, silent) {
		if (!this.escape.includes(MARKER)) this.escape.push(MARKER);

		let marker = value[0];
		let now = eat.now();
		now.column += 1;
		now.offset += 1;

		if (MARKER === marker && !/(\^[\s\n])|(\^$)/.test(value)) {
			let endMarkerIndex = value.match(/\^\S+/)[0].length;

			if (silent) return true;
			eat(value.substring(0, endMarkerIndex))({
				type: 'sup',
				children: this.tokenizeInline(
					value.substring(1, endMarkerIndex),
					now),
				data: {
					hName: 'sup'
				}
			});
		}
	}

	inlineTokenizer.locator = locator;
	var Parser = this.Parser;

	var inlineTokenizers = Parser.prototype.inlineTokenizers;
	var inlineMethods = Parser.prototype.inlineMethods;
	inlineTokenizers.sup = inlineTokenizer;
	inlineMethods.splice(inlineMethods.indexOf('text'), 0, 'sup');
}

module.exports = inlinePlugin;
