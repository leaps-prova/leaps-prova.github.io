$(document).ready (function(){
  if(!$("div").hasClass("coverpic")) {
 $( ".title").toggleClass('titlenoimage newClass');
}
});

$(document).ready(function(){
        $('.articleImg[src=""]').hide();
        $('.articleImg:not([src=""])').show();
    });
    