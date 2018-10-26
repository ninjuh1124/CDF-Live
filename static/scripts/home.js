$(function() {
	var page, tmpl;

	// initialize page
	var initPage = function() {
		$("title").html("Casual Discussion Friday");

		$.get("/html/home.html", (d) => {
			page = d;
		});

		$(document).ajaxStop(() => {
			$("body").html(page);
		});
	}();
})

