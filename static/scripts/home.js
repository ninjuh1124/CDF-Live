$(function() {
	var socket = io();

	var pageTmpl,		// page template
		commentTmpl,	// comment template
		history = [],	// comment history
		parents = $('#parent-comments');

	// initialize page
	var initPage = function() {

		$.get("/templates/home.html", (d) => {
			pageTmpl = d;
		});

		$.get("/templates/comment-template", (d) => {
			commentTmpl = d;
		});

		// load history onto page
		$.getJSON("/v1/history.json", (d) => {
			history = d;
		});

		$.each(history.history, (i, obj) {
			// TODO: move this to helper function
			if ($('#'+obj.parentID).length == 0) {
				parents.prepend(tmpl
					.replace(/{{COMMENT_ID}}/g, obj.id)
					.replace(/{{COMMENT_LINK}}/g, obj.permalink)
					.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
					.replace(/{{PARENT}}/g, obj.parentID)
					.replace(/{{COMMENT_BODY}}/g, obj.body_html)
				);
			} else {
				$('#'+obj.parentID+'-replies').prepend(tmpl
					.replace(/{{COMMENT_ID}}/g, obj.id)
					.replace(/{{COMMENT_LINK}}/g, obj.permalink)
					.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
					.replace(/{{PARENT}}/g, obj.parentID)
					.replace(/{{COMMENT_BODY}}/g, obj.body_html)
				);
			}
		});
	}();

	// start socket
	var socket = io();

	socket.on('comment', obj => {
		if (obj.kind == 'comment') {
			if ($('#'+obj.parentID).length == 0) {
				parents.prepend(tmpl
					.replace(/{{COMMENT_ID}}/g, obj.id)
					.replace(/{{COMMENT_LINK}}/g, obj.permalink)
					.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
					.replace(/{{PARENT}}/g, obj.parentID)
					.replace(/{{COMMENT_BODY}}/g, obj.body_html)
				);
			} else {
				$('#'+obj.parentID+'-replies').prepend(tmpl
					.replace(/{{COMMENT_ID}}/g, obj.id)
					.replace(/{{COMMENT_LINK}}/g, obj.permalink)
					.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
					.replace(/{{PARENT}}/g, obj.parentID)
					.replace(/{{COMMENT_BODY}}/g, obj.body_html)
				);
			}
		}
	});
})
