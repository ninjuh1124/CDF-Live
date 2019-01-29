import React from 'react';
import himalaya from 'himalaya';
import ReactMarkdown from 'react-markdown';

const CommentBody = (props) => {
	body = parseBody(props.body);
	render(
		<div className="comment-body" id={props.id} dangerouslySetInnerHTML={{__html: body}}></div>
	);
};

/** COMMENT BODY PARSING STUFF BELOW **/
/** I should move it to another file, but ¯\_(ツ)_/¯ **/

// converts markdown to react component, then stringifies
const parseBody = (md) => {
	let jsx = <ReactMarkdown source={md} escapeHtml={false} />
	let raw = React.renderToString(jsx);
	return parseTags(raw);
};

// parses tags of html string
const parseTags = (html) => {
	json = himalaya.parse(html);
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
	return himalaya.stringify(json);
};

// converts anchor ast object and converts to div ast object with child nodes
const convertToCommentFace = (anchor) => {
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

// takes anchor ast object and converts to span ast object
const convertToSpoiler = (anchor) => {
	let span = {
		type: "element",
		tagName: "span",
		attributes: [
			{
				key: "class",
				value: "spoiler"
			}
		],
		children: [
		]
	}

	if (anchor.children.length > 0) {
		span.children.push({
				type: "text",
				content: anchor.children[0].content
		});
	}
	if (anchor.attributes.length > 1) {
		span.children.push(
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
		);
	}

	return span;
}

export default CommentBody;
