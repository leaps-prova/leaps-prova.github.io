function retrieve_biblioRef() {
		var x = document.getElementsByClassName("biblioRef");
		var i;
		for (i = 0; i < x.length; i++) {
		x[i].style.backgroundColor = "red";
		}
}

 function show_biblioRef() {
	var x = document.getElementsByClassName("biblioRef");
	var i;
	var l = [];
	for (i = 0; i < count(); i++) {
		l.push(x[i]);
	}
	document.getElementById("show").innerHTML = l;
}

function count() {
	 var x = document.getElementsByClassName("biblioRef");
	 document.getElementById("demo").innerHTML = x.length;
}

// var l = [first_1];
//	for (i = 0; i < x.lenght; i++) {
//		l.push(x[i])
//	}
