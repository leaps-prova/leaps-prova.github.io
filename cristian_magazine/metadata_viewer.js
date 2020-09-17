
$("#styles").change(function() {
    var selectedStyle = $(this).children("option:selected").val();
    $("#ArticleCss").html("");
    $("#ArticleCss").load('' + selectedStyle + '.css');
    if ( $(window).width() < 768 ) {
        closeNav()
    }
});



window.onscroll = function() {myFunction()};

// Get the selector
var selector = document.getElementById("selector");

// Get the offset position of the selector
var sticky = selector.offsetTop;

// Add the sticky class to the selector when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    selector.classList.add("sticky")
  } else {
    selector.classList.remove("sticky");
  }
}

// ===== Scroll to Top ==== 
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});

var expandCollapse = function(){
    if ( $(window).width() < 768 ) {
        $(function(){
            // add a class .collapse to a div .showHide

            $('#selector').addClass('offcanvas');
        });
    }
    else {
        $(function(){
            // remove a class .collapse from a div .showHide

            $('#selector').removeClass('offcanvas');
            $('#fileWrapper').removeAttr('style');
            $('#selector').removeAttr('style');
        });
    }
}
function openNav() {
    closeOccurrences();
    $('.offcanvas').css('transform', 'translateX( 0 )');
    $('#fileWrapper').css('transform', 'translateX( 320px )');
    }

function closeNav() {
    $('.offcanvas').css('transform', 'translateX( -320px )');
    $('#fileWrapper').css('transform', 'translateX( 0 )');

}



function closeOccurrences() {
    document.getElementById('occurrences').style.display = 'none';
}


String.prototype.tpl = function (o) {
    var r = this;
    for (var i in o) {
        r = r.replace(new RegExp("\\$" + i, 'g'), o[i])
    }
    return r
}
$(document).ready(expandCollapse);
$(document).ready(main);
$(window).resize(expandCollapse);

var ajaxResult=[];


function main() {
    $('#metadataArticle').empty();
    $('#metadataIssue').empty();
    closeOccurrences()
    $('#file').empty();
    $('#paginationLinks').css('display', 'none');
    if ($(window).width() < 768) {
        closeNav()
    }
    
    $('.head-title').html(document.title);

    var title = $('meta[name="DC.title"]').attr("content");
    var editor = $('meta[name="DC.creator"]').attr("content");
    var subject = $('meta[name="DC.subject"]').attr("content");
    var date = $('meta[name="DCTERMS.issued"]').attr("content");
    var bibliographicCitation = $('meta[name="DCTERMS.bibliographicCitation"]').attr("content");
    
    $('#metadataIssue').append(`
                <p class="list title"><span class="label">Journal: </span>` + title + `</p>
                <p class="list editor"><span class="label">Editor: </span>`+ editor + `</p>
                <p class="list subject"><span class="label">Subject: </span>`+ subject + `</p>
                <p class="list date"><span class="label">Issued: </span>`+ date + `</p>
				<p class="list bibiographicCitation"><span class="label">Citation: </span>` + bibliographicCitation + `</p>`);
    
    
    $('#file').append(`<div id="IssueCover"><h1>` + title + `</h1>
                <p class="IssueBibliographicCitation">` + bibliographicCitation + `</p><div id="IssueIndex"></div></div>`);
    
    var ArticleInfo = `<div class="ArticleInfo">
    <p class="coverLabel"><a href='#' onclick='loadArticle("$url")'>$label</a></p>
    <p class="coverAuthor">$author</p>
    <p class="coverIssued">$issued</p>`;

    var authorstpl = `<p class="list authors"><span class="label">Articles Written by: </span>$authors</p>`;
    var keywordstpl = `<p class="list keywords"><span class="label">keywords: </span>$keywords</p>`
    
    $.ajax({
        method: 'GET',
        url: 'filelist.json',
        success: function (d) {
            var authorsIssue = [];
            var keywordsIssue = [];

            for (var i = 0; i < d.length; i++) {
                
                var authorsList = d[i].author.split(', ');
                var keywordsList = d[i].keywords.split(', ');
                for (var j = 0; j < authorsList.length; j++) {
                    authorsIssue.push(`<a href="#" onclick="loadArticle('` + d[i].url + `')">` + authorsList[j] + `</a>`);
                }
                for (var j = 0; j < keywordsList.length; j++) {
                    keywordsIssue.push(`<a href="#" onclick="loadArticle('` + d[i].url + `')">#` + keywordsList[j] + `</a>`);
                }
                
                $('#IssueIndex').append(ArticleInfo.tpl({
                    url: d[i].url,
                    label: d[i].label,
                    author: d[i].author,
                    issued: d[i].issued
                }));
            }
            
            authorsIssue = authorsIssue.join(', ');
            keywordsIssue = keywordsIssue.join(', ');
           
            $('#metadataIssue').append(authorstpl.tpl({
                authors : authorsIssue
            }));
            $('#metadataIssue').append(keywordstpl.tpl({
                keywords : keywordsIssue
            }));
            
            ajaxResult.push(d);
            
        },
        error: function () {
            alert('No document to show')
        }
    });
}


function getPrevious(file) {
    $('#paginationLinks .previous').removeAttr('style');
    articlesArray = ajaxResult[0];
    for (var i = 0; i < articlesArray.length; i++) {
        if (articlesArray[i].url === file) {
            if (i - 1 >= 0) {
                var prev_file = articlesArray[i - 1].url;
                return prev_file
            }
            else {
                $('#paginationLinks .previous').css('visibility', 'hidden');
            }
        }
    }
}

function getNext(file) {
    $('#paginationLinks .next').removeAttr('style');
    articlesArray = ajaxResult[0];
    for (var i = 0; i < articlesArray.length; i++) {
        if (articlesArray[i].url === file) {
            if (i + 1 < articlesArray.length) {
                var next_file = articlesArray[i + 1].url;
                return next_file
            }
            else {
                $('#paginationLinks .next').css('visibility', 'hidden');
            }
        }
    }
}

function loadDisclaimer() {
    $('#file').empty();
    $('#metadataArticle').empty();
    closeOccurrences();
    if ($(window).width() < 768) {
        closeNav()
    }
    var articlesArray = ajaxResult[0];
    var sources = [];
    var publishers = [];
    for (var i = 0; i < articlesArray.length; i++) {
        publishers.push(articlesArray[i].publisher);
        var source_str = `<li><a href="` + articlesArray[i].source + `" target="_blank">` + articlesArray[i].source + `</a></li>`;
        sources.push(source_str);
    }
    publishers = publishers.join(', ');
            
    $('#file').append(`<div id="disclaimer"><p>The purpose of this web site is to explore various types of typographic and layout style for text documents, as an end-of-course project for the "Information Modeling and Web technologies" course of the Master Degree in Digital Humanities and Digital Knowledge of the University of Bologna, under prof. Fabio Vitali.</p>
                <p>The documents contained in this web site have been selected for their length and complexity from ` + publishers + `. Their publication here is not intended to be an alternative or replace their original locations:</p>
                <ul>
                </ul>
                <p class="copyright">All copyrights and related rights on the content remain with their original owners. All copyright on the typographic and layout choices are 2020 © Cristian Santini</p></div>`);
    for (var i = 0; i < sources.length; i++) {
        $('#disclaimer ul').append(sources[i]);
    }
    $('#paginationLinks').css('display', 'block');
    $('#paginationLinks .previous').removeAttr('style');
    $('#paginationLinks .previous').attr("onclick","loadArticle('"+ articlesArray[articlesArray.length - 1].url +"')");
    $('#paginationLinks .next').css('visibility', 'hidden');
}


function loadArticle(file) {
    $('#file').empty();
    $('#metadataArticle').empty();
    $('#paginationLinks').css('display', 'block');
    closeOccurrences();
    
    
    $('#metadataArticle').append(` <div class="row clearfix mt-3">
        <div class="col-md-12">
        <h4>In this article:</h4>
            <ul class="nav nav-tabs" id="leftTab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="view" aria-selected="true">Info</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="toc-tab" data-toggle="tab" href="#toc" role="tab" aria-controls="view" aria-selected="true">Table of Content</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="visual-tab" data-toggle="tab" href="#visual" role="tab" aria-controls="view" aria-selected="true">Figures & Tables</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="entities-tab" data-toggle="tab" href="#entities" role="tab" aria-controls="view" aria-selected="true">Named Entities</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="references-tab" data-toggle="tab" href="#references" role="tab" aria-controls="view" aria-selected="true">References</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="footnotes-tab" data-toggle="tab" href="#footnotes" role="tab" aria-controls="view" aria-selected="true">Notes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="asides-tab" data-toggle="tab" href="#asides" role="tab" aria-controls="view" aria-selected="true">Asides</a>
                </li>
            </ul>
            <div class="tab-content" id="leftContent">
                <div class="tab-pane active myBorder myBorder-notop" id="info" role="tabpanel" aria-labelledby="info-tab">
                </div>
                <div class="tab-pane myBorder myBorder-notop" id="toc" role="tabpanel" aria-labelledby="toc-tab">
                    <ul class="minimal"></ul>
                </div>
                <div class="tab-pane myBorder myBorder-notop" id="visual" role="tabpanel" aria-labelledby="visual-tab">
                </div>
                <div class="tab-pane myBorder myBorder-notop" id="entities" role="tabpanel" aria-labelledby="entities-tab">
                </div>
                <div class="tab-pane myBorder myBorder-notop" id="references" role="tabpanel" aria-labelledby="references-tab">
                    <ul class="minimal"></ul>
                </div>
                <div class="tab-pane myBorder myBorder-notop" id="footnotes" role="tabpanel" aria-labelledby="footnotes-tab">
                    <ul class="minimal"></ul>
                </div>
                <div class="tab-pane myBorder myBorder-notop" id="asides" role="tabpanel" aria-labelledby="asides-tab">
                    <ul class="minimal"></ul>
                </div>
            </div>
        </div>
    </div>`);
    var prev_file = getPrevious(file);
    var next_file = getNext(file);
    $('#paginationLinks .previous').attr("onclick","loadArticle('"+prev_file+"')");
    $('#paginationLinks .next').attr("onclick","loadArticle('"+next_file+"')");
    if ($(window).width() < 768) {
        closeNav()
    }

    $.ajax({
        method: 'GET',
        url: file,
        success: function (d) {
            $('#file').html(d);
            $('.head-title').html($('#file h1').html());
            addIds();
            fillInfo('#file', '#info');
            fillTabs();
            addReverseAccess(['person', 'place', 'entity', 'concept', 'event']);
        },
        error: function () {
            alert('Could not load ' + file)
        }
    });
}

function addIds() {
    addId('#file .person', 'person')
    addId('#file .place', 'place')
    addId('#file .entity', 'thing')
    addId('#file .concept', 'concept')
    addId('#file .event', 'event')
    addId('#file h2', 'heading')
    addId('#file table', 'table')
    addId('#file figure', 'figure')
}

function addId(what, prefix) {
    if (!$(what + '[id]').length) {
        var id = '0'
        var elements = $(what);
        for (var i = 0; i < elements.length; i++) {
            elements[i].id = prefix + "-" + id++
        }
    }
}

function fillInfo(from, where) {
    var item = `
				<p class="list $name"><span class="label">$label: </span> $content</p>	
				` ;
    $(where).empty(); 
    var elements = $(from + ' meta');
    for (var i = 0; i < elements.length; i++) {
        var name = elements[i].getAttribute("name");
        if (name.substr(0, 2) == 'DC') {
            var regex = /^DC.*\./;
            var name = name.replace(regex, '');
            var label = name[0].toUpperCase() + name.slice(1);
            var content = elements[i].getAttribute("content");
            $(where).append(item.tpl({
                name: name,
                label: label,
                content: content
            }));
        }
    }
}

function fillTabs() {
    fillTab('#file h2', 'heading', '#toc')
    fillTab('#file .biblioItem', 'references', '#references')
    fillTab('#file .footNote', 'footnotes', '#footnotes')
    fillTab('#file .aside', 'asides', '#asides')
    fillVisualContentTab({"#file figure": "figure", "#file table": "table"}, '#visual' )
    fillIndex({"#file .person":"person", "#file .place": "place", "#file .entity" : "thing", "#file .concept" : "concept", "#file .event" : "event"}, "#entities")
}

function fillTab(what, style, where) {
    var listItem = `<li class="list $style"><a href="#" onclick="goto('$place')">$content</a></li>`;
    $(where +' ul').empty(); 
    var elements = $(what);
    if ($(what).length) {
        for (var i = 0; i < elements.length; i++) {
            $(where + ' ul').append(listItem.tpl({
                style: style,
                place: '#' + elements[i].id,
                content: elements[i].innerHTML
            }));
        }        
    }
    else {
        $(where + '-tab').remove();
        $(where).remove();
    }
}


function fillVisualContentTab(input_obj, where) {
    var visualItem = `<div class="$what-wrapper"><$what class="$what-widget">$content</$what></div>`;
    var k = 0;
    $(where).empty();
    for (key in input_obj) {
        if (input_obj.hasOwnProperty(key)) {
            var elements = $(key);
            var style = input_obj[key];
            if ($(key).length) {
                k++;
                $(where).append('<h5>' + style[0].toUpperCase() + style.slice(1) + 's</h5>');
                for (var i = 0; i < elements.length; i++) {
                    $(where).append(visualItem.tpl({
                        what: style,
                        content: elements[i].innerHTML
                    }));
                    if (style == 'figure') {
                        var imgurl = $('#file figure img').eq(i).attr('src');
                        $('.figure-widget').eq(i).append('<a href="' + imgurl + '" target ="_blank">View original</a>');
                    }
                }
                
            }
        }
    }
    if (k == 0) {
        $(where + '-tab').remove();
        $(where).remove();
    }
}



function fillIndex(input_obj, where) {
    var listItem = `<li class="list $style"><a href="javascript:void(0)" onclick="fillOccurrenceTab('$what', 'occurrence', '#occurrences')">$content</a> ($num)</li>`;
    var k = 0;
    $(where).empty();
    for (key in input_obj) {
        if (input_obj.hasOwnProperty(key)) {
            var elements = $(key);
            var style = input_obj[key];
            if ($(key).length) {
                k++;
                $(where).append('<h5>' + style[0].toUpperCase() + style.slice(1) + 's</h5><ul></ul>');
                var namedict = {};
                for (var i = 0; i < elements.length; i++) {
                    var currName = elements[i].innerText;
                    var className = currName.split(' ').join('-').replace(/[\.\'\"\!\?\*]/g, '');
                    elements[i].classList.add(className);
                    if (!(currName in namedict)) {
                        namedict[currName] = 0;
                    }

                    namedict[currName]++;
                }
                var arrOfArrays = Object.entries(namedict).sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
                for (const [key, value] of arrOfArrays) {
                    var className = key.split(' ').join('-').replace(/[\.\'\"\!\?\*]/g, '');
                    $(where + " ul").last().append(listItem.tpl({
                        content: String(key),
                        num: String(value),
                        what: '#file .' + className,
                        style: style,
                    }));
                }
            }
        }
    }
    if (k == 0) {
        $(where + '-tab').remove();
        $(where).remove();
    }
}



function fillOccurrenceTab(what, style, where) {
    var list = `<li class="list $style"><a href="#" onclick="goto('$place')">$content</a></li>`;
    $(where + ' h5').empty();
    $(where + ' ul').empty();
    var elements = $(what);
    $(where + ' h5').append(elements[0].innerText);
    for (var i = 0; i < elements.length; i++) {
        $(where + ' ul').append(list.tpl({
            style: style,
            place: '#' + elements[i].id,
            content: elements[i].innerText
        }));
    }
    $('#wikiLink').empty();
    var wikiName = elements[0].innerText.split(' ').join('_').replace(/[\.\'\"\!\?\*]/g, '');
    $('#wikiLink').attr('href', 'https://en.wikipedia.org/wiki/' + wikiName);
    $('#wikiLink').html('Search ' + elements[0].innerText + ' on Wikipedia');
    if ( $(window).width() < 768 ) {
        closeNav()
    }
    $(where).fadeIn(200);

}

function goto(id) {
    if ( $(window).width() < 768 ) {
        closeNav()
    }
    $('html, body').animate({
        scrollTop: $(id).offset().top - 130
    }, 200);
    $(id).addClass('animate');
    setTimeout(function () {
        $(id).removeClass('animate');
    }, 5000);
}



function addReverseAccess(arrayClasses) {
    for (var i = 0; i < arrayClasses.length; i++) {
        var elements = $('#file .'+ arrayClasses[i]);
        for (var j = 0; j < elements.length; j++) {
            $(elements[j]).html(`<a href="javascript:void(0)" onclick="reverseAccess(this)">`+$(elements[j]).text()+`</a>`);
        }
    }
}

function reverseAccess(obj) {
    var name = $(obj).text();
    var className = name.split(' ').join('-').replace(/[\.\'\"\!\?\*]/g, '');
    var what = '#file .' + className;
    fillOccurrenceTab(what, 'occurrences', '#occurrences');
}