function floatCoverPic() {
	var coverpic = document.getElementByClassName('coverpic');
	var mytitle = document.getElementByClassName('title'); 
	if (document.body.contains(coverpic)) {
	mytitle.className = "titlenoimage"; 
	}
}

$("p").hide()


if ($("body").hasClass(".coverpic")) {
	$("div.title").removeClass(".title")
	$("div.title").addClass(".titlenoimage")
}