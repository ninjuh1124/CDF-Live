$(function () {
	var page;

	$.get('/html/about.html', d => {
		page = d;
	});

	$(document).ajaxStop( () => {
		$("body").html(page);
	})
})
