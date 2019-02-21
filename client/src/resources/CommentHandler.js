import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {parse, stringify} from 'himalaya';
import ReactMarkdown from 'react-markdown';
import facecodes from './facecodes';

// returns raw html string from markdown
// this is a completely stupid way of doing, and most definitely shouldn't
// be done this way, but goddammit I'm not writing my own Markdown parser
export const parseBody = (md) => {
	let jsx = <ReactMarkdown source={md.replace(/^#{1,}/gm, '$& ')} />
	let raw = ReactDOMServer.renderToString(jsx);
	return parseTags(parse(raw));
};

// parses tags of html string
const parseTags = (json) => {
	for (let i=0; i<json.length; i++) {
		if (json[i].type === "element" && json[i].tagName === 'a') {
			if (isCommentFace(json[i])) {
				json[i] = convertToCommentFace(json[i]);
			} else if (isSpoiler(json[i])) {
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
	return stringify(json);
};

// checks if element is a spoiler
const isSpoiler = (json) => {
	if (json.type === "element" && json.tagName === 'a') {
		for (let i=0; i<json.attributes.length; i++) {
			if (json.attributes[i].key !== "href") continue;
			else if (json.attributes[i].value === "/s") return true;
		}
	}
	return false;
}

// checks if element is a comment face
const isCommentFace = (json) => {
	if (json.type === "element" && json.tagName === 'a') {
		for (let i=0; i<json.attributes.length; i++) {
			if (json.attributes[i].key !== "href") continue;
			else if (/^#\S+/.test(json.attributes[i].value)) return true;
		}
	}
	return false
}

// converts anchor ast object and converts to div ast object with child nodes
const convertToCommentFace = (anchor) => {
	// get attributes
	let href = null;
	let title = null;
	anchor.attributes.map(attr => {
		if (attr.key === "href") href = attr.value;
		else if (attr.key === "title") title = attr.value;
	});

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
				value: facecodes[href] || '/faces/notfound.jpg'
			},
			{
				key: "alt",
				value: href
			},
			{
				key: "class",
				value: "face"
			}
		]
	});
	// hovertext
	if (anchor.attributes[1]) {
		container.children[0].attributes.push({
			key: "title",
			value: title
		});
	}

	// overlay text
	if (anchor.children.length > 0) {
		for (let i=0; i<anchor.children.length; i++) {
			// top text
			if (anchor.children[i].type === 'text') {
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
			} else if (anchor.children[i].type === 'element' && anchor.children[i].tagName === 'strong') {
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
	// get attributes
	let title;
	anchor.attributes.map(attr => {
		if (attr.key === "title") title = attr.value;
	});

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
						content: title
					}
				]
			}
		);
	}

	return span;
}
