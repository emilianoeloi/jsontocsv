$(document).ready(function(){

	iDB.open(refreshConversions);

	var newConvertSubmit = document.getElementById('convert');
	var newConversion = document.getElementById('ta-json');

	$("form").submit(function(){
	  	var text = newConversion.value;
	  	$("#conversion-items").empty();

		if (text.replace(/ /g,'') != '') {
	       iDB.createConversion(text, function(conversion) {
	         refreshConversions();
	       });
	    }

	    return false;
	});

	function refreshConversions() {  
	  iDB.fetchConversions(function(conversions) {

	    for(var i = 0; i < conversions.length; i++) {
	      
	      var conversion = conversions[(conversions.length - 1 - i)];

	      var li = document.createElement('li');
	      li.id = 'conversion-' + conversion.timestamp;

	      var img = document.createElement('img');
	      img.className = "todo-checkbox";
	      img.src = "assets/img/remove2.png";
	      img.setAttribute("data-id", conversion.timestamp);

	      li.appendChild(img);

	      var anchor = document.createElement('a');
	      anchor.href = "#";

	      var span = document.createElement('span');
	      span.innerHTML = conversion.text;

	      anchor.appendChild(span);

	      li.appendChild(anchor);

	      $("#conversion-items").append(li);

	    }

	    $("li img").click(function(){
	    	var id = $(this).data("id");

	    	$("#conversion-items").empty();
		  	iDB.deleteTodo(id, refreshConversions);
		});

		$("a span").click(function(){
	    	var textJSON = $(this).text();
	    	$("#ta-json").val(textJSON);

		});

	  });
	}

	$('.menu-anchor').on('click', function(e){
		$('html').toggleClass('menu-active');
	  	e.preventDefault();
	});
});