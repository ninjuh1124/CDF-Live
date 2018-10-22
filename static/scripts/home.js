$(function() {
	var page;

	// initialize page
	var initPage = function() {

		$.get("/html/home.html", (d) => {
			page = d;
		});

		$(document).ajaxStop(() => {
			$("body").html(page); 
		});
	}();
})
