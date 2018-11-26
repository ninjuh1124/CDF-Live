function handleFace(a) {
	let face = document.createElement('div');
	face.className = "container";

	let img = document.createElement('img');
	img.src = "/faces/" + facecodes[a.href];
	img.title = a.title;
	face.appendChild(img);

	let toptext = document.createElement('div');
	toptext.className = "top";
	toptext.innerText = a.innerText;
	face.appendChild(toptext);

	if (a.children.length > 0){
		let bottomtext = document.createElement('div');
		bottomtext.className = "bottom";
		bottomtext.innerText = a.children[0].innerText;
		face.appendChild(bottomText);
	}

	return face;
}

function parse(body) {
	let html = new DOMParser().parseFromString(body, 'text/html').body
	let anchors = html.getElementsByTagName('a');
	for (let i=0; i<anchors.length; i++) {
		if (anchors[i].href.charAt(0) == '#') {
			html.replaceChild(handleFace(anchors[i]), anchors[i]);;
		}
	}

	return html.innerHTML;
}

function handleFace(body) {
	console.log('face found: ' + body);
	return null;
}

function attachComment(tmpl, obj, target) {
	target.prepend(tmpl
		.replace(/{{COMMENT_ID}}/g, obj._id)
		.replace(/{{COMMENT_LINK}}/g, obj.permalink)
		.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
		.replace(/{{PARENT}}/g, obj.parentID)
		.replace(/{{COMMENT_BODY}}/g, parse(obj.body_html))
	);
}

function attachThread(tmpl, obj, target) {
	target.prepend(tmpl
		.replace(/{{THREAD_LINK}}/g, obj.permalink)
		.replace(/{{THREAD_ID}}/g, obj.id)
	);
}
