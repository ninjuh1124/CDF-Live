$(function() {
	var socket = io();
	var tmpl;
	const parentComments = $('#parent-comments');

	$.get('/html/comment-template.html', d => {
		tmpl = d;
	});

	function attachComment(obj, target) {
		target.prepend(tmpl
			.replace(/{{COMMENT_ID}}/g, obj.id)
			.replace(/{{COMMENT_LINK}}/g, obj.permalink)
			.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
			.replace(/{{PARENT}}/g, obj.parentID)
			.replace(/{{COMMENT_BODY}}/g, obj.body_html)
		);
	}

	socket.on('comment', obj => {
		if (obj.kind == 'comment') {	// just to make sure
			if ($('#'+obj.parentID).length == 0) {	// parent is not on page
				attachComment(obj, parentComments);
			} else {
				attachComment(obj, $('#'+obj.parentID+'-replies'));
			}
		}
	});
})
