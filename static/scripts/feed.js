$(function() {
	var socket = io();
	var ctmpl, ttmpl, facecodes = {};
	const parentComments = $('#parent-comments');

	$.get('/v1/facecodes.json', d => {
		facecodes = d.data;
		console.log(typeof facecodes);
	});
	$.get('/html/comment-template.html', d => {
		ctmpl = d;
	});
	$.get('/html/thread-template.html', d => {
		ttmpl = d;
	});
	$.get('/v1/history.json', d => {
		$.each(d.data, (i, obj) => {
			if ($('#'+obj.parentID).length == 0) {
				attachComment(ctmpl, obj, parentComments);
			} else {
				attachComment(tmpl, obj, $('#'+obj.parentID+'-replies'));
			}
		});
	});

	socket.on('comment', obj => {
		if (obj.kind == 'comment') {	// just to make sure
			if ($('#'+obj.parentID).length == 0) {	// parent is not on page
				attachComment(ctmpl, obj, parentComments);
			} else {
				attachComment(ctmpl, obj, $('#'+obj.parentID+'-replies'));
			}
		}
	});

	socket.on('thread', obj => {
		if (obj.kind == 'submission') {	// insurance purposes
			attachThread(ttmpl, obj, parentComments);
			$("#latest").attr("href", obj.permalink);
		}
	});
})
