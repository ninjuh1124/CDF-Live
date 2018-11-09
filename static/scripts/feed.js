$(function() {
	var socket = io();
	var tmpl;
	const parentComments = $('#parent-comments');

	$.get('/html/comment-template.html', d => {
		ctmpl = d;
	});
	$.get('/html/thread-template.html', d => {
		ttempl = d;
	});

	function attachComment(obj, target) {
		target.prepend(ctmpl
			.replace(/{{COMMENT_ID}}/g, obj._id)
			.replace(/{{COMMENT_LINK}}/g, obj.permalink)
			.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
			.replace(/{{PARENT}}/g, obj.parentID)
			.replace(/{{COMMENT_BODY}}/g, obj.body_html)
		);
	}

	socket.on('comment', obj => {
		if (obj.kind == 'comment') {	// just to make sure
			console.log(obj.body);
			if ($('#'+obj.parentID).length == 0) {	// parent is not on page
				attachComment(obj, parentComments);
			} else {
				attachComment(obj, $('#'+obj.parentID+'-replies'));
			}
		}
	});

	socket.on('thread', obj => {
		if (obj.kind == 'submission') {	// insurance purposes
			parentComments.prepend(ttmpl
				.replace(/{{THREAD_LINK}}/g, obj.permalink)
				.replace(/{{THREAD_ID}}/g, obj.id)
			);
			$("#latest").attr("href", obj.permalink);
		}
	});
})
