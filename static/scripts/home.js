$(function() {
	var page, tmpl,
		latest = {},
		data = {};
		
	// initialize page
	var initPage = function() {
		$("title").html("Casual Discussion Friday");

		$.get("/html/home.html", (d) => {
			page = d;
		});

		$.get("/v1/history.json", (d) => {
			$.extend(data, d.data);
		});
		$.get("/v1/thread.json", (d) => {
			$.extend(latest, d.data);
		});
		$.get("/html/comment-template.html", (d) => {
			tmpl = d;
		});

		function attachComment(obj, target) {
			target.prepend(tmpl
				.replace(/{{COMMENT_ID}}/g, obj._id)
				.replace(/{{COMMENT_LINK}}/g, obj.permalink)
				.replace(/{{COMMENT_AUTHOR}}/g, obj.author)
				.replace(/{{PARENT}}/g, obj.parentID)
				.replace(/{{COMMENT_BODY}}/g, obj.body_html)
			);
		}   

		$(document).ajaxStop(() => {
			$("body").html(page);
			$("#latest").attr("href", latest[0].permalink);
			const parentComments = $('#parent-comments');
			$.each(data, (i, obj) => {
				if ($('#'+obj.parentID).length == 0) {
					attachComment(obj, parentComments);
				} else {
					attachComment(obj, $('#'+obj.parentID+'-replies'));
				}
			});
		});
	}();
})

