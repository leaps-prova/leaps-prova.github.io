function retrieve_biblioRef() {
		var x = document.getElementsByClassName("biblioRef");
		var i;
		for (i = 0; i < x.length; i++) {
		x[i].style.backgroundColor = "red";
		}
}

function show_biblioRef() {
	var x = document.getElementsByClassName("label");
	var i;
	var l = [];
	for (i = 0; i < 9; i++) {
		l.push(x[i]);
	}
	document.getElementById("show").innerHTML = l.lenght;
}


// var l = [first_1];
//	for (i = 0; i < x.lenght; i++) {
//		l.push(x[i])
//	}