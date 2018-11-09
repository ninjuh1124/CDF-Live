$(function() {
	var page, tmpl,
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

		$(document).ajaxStop(() => {
			$("body").html(page);
		});
	}();
})

