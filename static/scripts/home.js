$(function() {
	var pageTmpl;

	// initialize page
	var initPage = function() {

		$.get("/html/home.html", (d) => {
			pageTmpl = d;
		});

		$(document).ajaxStop(() => {
			$("body").html(pageTmpl); 
		});
	}();
})
