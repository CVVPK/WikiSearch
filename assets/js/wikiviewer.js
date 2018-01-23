$(document).ready(function(){
	var offset = 0;

	function buildResult(result){
		// Builds each result's html and adds it to page
		var anchorHtml = "href = 'https://en.wikipedia.org/wiki/" + result.title + "'" + "target = '_blank'"
		var resultBody = "<h3>" + result.title + "</h3>" + result.snippet
		$("#results").append("<li><a " + anchorHtml + ">" + resultBody + "</a></li>")
	}

	function results(searchResults){
		// Data extraction
		// searchResults.query.search[].snippet/title
		var results = searchResults.query.search;
		results.forEach(buildResult);
	}

	function wikiSearch(){
		var search = $("#search").val();
		$.ajax({
			url: "https://en.wikipedia.org/w/api.php",
			data: {
				action: "query",
				list: "search",
				srprop: "snippet",
				srlimit: "10",
				sroffset: offset,
				srsearch: search,
				format: "json"
			},
			dataType: "jsonp",
			success: results
		});
		offset +=10;
	}

	function getDocHeight() {
	    var D = document;
	    return Math.max(
	        D.body.scrollHeight, D.documentElement.scrollHeight,
	        D.body.offsetHeight, D.documentElement.offsetHeight,
	        D.body.clientHeight, D.documentElement.clientHeight
	    );
	}

	$("form").on("submit", function(){
		offset = 0;	// reset offset to 0 when making new search
		if($(this).children("input").val() != ""){
			$(this).parent().removeClass("centered");
			$(this).parent().addClass("top");
			$(this).next().empty();
			wikiSearch();
		}
		return false; // prevent page from refreshing on form submit
	});

	$("#searchTitle").on("click", function(){
		$(this).parent().removeClass("top");
		$(this).parent().addClass("centered");
		$(this).next().children("input").val("");
		$(this).siblings("ul").empty();
	})
	
	$(window).scroll(function() {
       if($(window).scrollTop() + $(window).height() == getDocHeight() &&
       	$("#searchContainer").attr("class") != "centered") {
       		$("#results").append("<hr>");
       		wikiSearch();
       	}
   	});

});
