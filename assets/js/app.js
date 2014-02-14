$(document).ready(function(){

	iDB.open(refreshConversions);

	var newConvertSubmit = document.getElementById('convert');
	var newConversion = document.getElementById('ta-json');

	$("form").submit(function(){
	  	var text = newConversion.value;
	  	console.log('text: ' + text);

		if (text.replace(/ /g,'') != '') {
	       iDB.createConversion(text, function(conversion) {
	         refreshConversions();
	       });
	    }

	    return false;
	});

	function refreshConversions() {  
	  iDB.fetchConversions(function(conversions) {
	    var conversionList = document.getElementById('conversion-items');

	    for(var i = 0; i < conversions.length; i++) {
	      var conversion = conversions[(conversions.length - 1 - i)];

	      var li = document.createElement('li');
	      li.id = 'conversion-' + conversion.timestamp;
	      var checkbox = document.createElement('input');
	      checkbox.type = "checkbox";
	      checkbox.className = "todo-checkbox";
	      checkbox.setAttribute("data-id", conversion.timestamp);

	      li.appendChild(checkbox);

	      var span = document.createElement('span');
	      span.innerHTML = conversion.text;

	      li.appendChild(span);

	      conversionList.appendChild(li);

	      checkbox.addEventListener('click', function(e) {
	      	var id = parseInt(e.target.getAttribute('data-id'));

	      	  iDB.deleteTodo(id, refreshConversions);
	      });
	    }

	  });
	}

	$('.menu-anchor').on('click', function(e){
		$('html').toggleClass('menu-active');
	  	e.preventDefault();
	});
});