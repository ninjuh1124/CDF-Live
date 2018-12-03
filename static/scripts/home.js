$(function() {
	var page,
		latest = {},
		data = {};
		
	// initialize page
	var initPage = function() {
		$("title").html("Casual Discussion Friday");

		$.get("/html/home.html", (d) => {
			page = d;
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
		});
	}();
})

