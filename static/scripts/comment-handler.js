var facecodes = {};	// there's probably a way around using a global
					// i'm not looking for it
$(function () {
	$.get("/v1/facecodes.json", d => {
		$.extend(facecodes, d);
	});
})
// holy fuck this was annoying to write
function convertToCommentFace(anchor) {
	let container = {
		type: "element",
		tagName: "div",
		attributes: [
			{
				key: "class",
				value: "comment-face"
			}
		],
		children: []
	}
	// img
	container.children.push({
		type: "element",
		tagName: "img",
		attributes: [
			{
				key: "src",
				value: facecodes[anchor.attributes[0].value] || '/faces/notfound.jpg'
			}
		]
	});
	// hovertext
	if (anchor.attributes[1]) {
		container.children[0].attributes.push({
			key: "title",
			value: anchor.attributes[1].value
		});
	}

	// overlay text
	if (anchor.children.length > 0) {
		for (let i=0; i<anchor.children.length; i++) {
			// top text
			if (anchor.children[i].type == 'text') {
				container.children.push({
					type: 'element',
					tagName: 'div',
					attributes: [
						{
							key: 'class',
							value: 'top'
						}
					],
					children: [
						{
							type: 'text',
							content: anchor.children[i].content
						}
					]
				});
			// bottom text
			} else if (anchor.children[i].type == 'element' && anchor.children[i].tagName == 'strong') {
				container.children.push({
					type: 'element',
					tagName: 'div',
					attributes: [
						{
							key: 'class',
							value: 'bottom'
						}
					],
					children: [
						{
							type: 'text',
							content: anchor.children[i].children[0].content
						}
					]
				});
			}
		}
	}

	return container;
}

function convertToSpoiler(anchor) {
	return {
		type: "element",
		tagName: "span",
		attributes: [
			{
				key: "class",
				value: "spoiler"
			}
		],
		children: [
			{
				type: "text",
				content: anchor.children[0].content
			},
			{
				type: "element",
				tagName: "span",
				attributes: [
					{
						key: "class",
						value: "spoiler-inner"
					}
				],
				children: [
					{
						type: "text",
						content: anchor.attributes[1].value
					}
				]
			}
		]
	}
}

// searches recursively through markdown generated tags
function parseTags(json) {
	for (let i=0; i<json.length; i++) {
		if (json[i].tagName == 'a') {
			if (/^#\S+/.test(json[i].attributes[0].value)) {
				json[i] = convertToCommentFace(json[i]);
			} else if (json[i].attributes[0].value == "/s") {
				json[i] = convertToSpoiler(json[i]);
			} else {
				continue;
			}
		} else {
			if (json[i].children) {
				parseTags(json[i].children);
			}
			continue;
		}
	}
	return json;
}

// converts comment markdown to html
function parse(body) {
	let converter = new showdown.Converter({noHeaderId: true}),
		html = converter.makeHtml(body)
		json = window.himalaya.parse(html);

	json = parseTags(json);
	html = window.himalaya.stringify(json);
	return html;
}

// TODO: combine these functions into one

// attaches comment to feed
function attachComment(tmpl, obj, target) {
	target.prepend(tmpl
		.replace(/{{COMMENT_ID}}/g, obj._id)
		.replace(/{{COMMENT_LINK}}/g, obj.permalink)
		.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
		.replace(/{{PARENT}}/g, obj.parentID)
		.replace(/{{COMMENT_BODY}}/g, parse(obj.body))
	);
}

// attaches thread announcement to feed
function attachThread(tmpl, obj, target) {
	target.prepend(tmpl
		.replace(/{{THREAD_LINK}}/g, obj.permalink)
		.replace(/{{THREAD_ID}}/g, obj.id)
	);
}
