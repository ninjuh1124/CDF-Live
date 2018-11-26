$(function() {
	var page, tmpl, facecodes,
		latest = {},
		data = {};
		
	// initialize page
	var initPage = function() {
		$("title").html("Casual Discussion Friday");

		$.get("/v1/facecodes.json", (d) => {
			facecodes = d.data;
		});

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

		$(document).ajaxStop(() => {
			$("body").html(page);
			$("#latest").attr("href", latest[0].permalink);
			const parentComments = $('#parent-comments');
			$.each(data, (i, obj) => {
				if ($('#'+obj.parentID).length == 0) {
					attachComment(tmpl, obj, parentComments);
				} else {
					attachComment(tmpl, obj, $('#'+obj.parentID+'-replies'));
				}
			});
		});
	}();
})

