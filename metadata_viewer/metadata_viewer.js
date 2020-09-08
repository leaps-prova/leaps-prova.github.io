
$("#styles").change(function() {
    var selectedStyle = $(this).children("option:selected").val();
    $("#ArticleCss").html("");
    $("#ArticleCss").load('' + selectedStyle + '.css');
    if ( $(window).width() < 768 ) {
        closeNav()
    }
});



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
            // set display: "" in css for the toggle button .btn.btn-primary
            $('.closebtn').css('display', 'inline-block');// removes display property to make it visible
            $('.openbtn').css('display', 'block');// removes display property to make it visible
        });
    }
    else {
        $(function(){
            // remove a class .collapse from a div .showHide
            $('#selector').removeClass('offcanvas');
            $('#fileWrapper').removeAttr('style');
            $('#selector').removeAttr('style');
            // set display: none in css for the toggle button .btn.btn-primary  
            $('.closebtn').css('display', 'none');// hides button display on bigger screen
            $('.openbtn').css('display', 'none');// hides button display on bigger screen
        });
    }
}
function openNav() {
    $('.offcanvas').css('transform', 'translateX( 0 )');
    $('.fileWrapper').css('transform', 'translateX( 320px )');
    }
function closeNav() {
    $('.offcanvas').css('transform', 'translateX( -100% )');
    $('.fileWrapper').css('transform', 'translateX( 0 )');
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
    $('#metadataViewer').empty();
    $('#issueInfo').empty();
    $('#file').empty();
    $('#paginationLinks').css('display', 'none');
    $('.coverLink').css('display', 'none');
    if ($(window).width() < 768) {
        closeNav()
    }
    var title = $('meta[name="DC.title"]').attr("content");
    var author = $('meta[name="DC.creator"]').attr("content");
    var bibliographicCitation = $('meta[name="DCTERMS.bibliographicCitation"]').attr("content");
    $('#issueInfo').append(`
                <h3 id="issueTitle">` + title + `</h3>
                <p class="list author">`+ author + `</p>
				<p class="list bibiographicCitation">` + bibliographicCitation + `</p>`);

    $('#file').append(`<div id="IssueIndex"><h1>` + title + `</h1>
                <p class="IssueBibliographicCitation">` + bibliographicCitation + `</p></div>`);

    
    var ArticleInfo = `<div class="ArticleInfo">
        <p class="coverLabel"><a href='#' onclick='load("$url")'>$label</a></p>
        <p class="coverAuthor">$author</p>
        <p class="coverIssued">$issued</p>
        <p class="coverSource"><a href="$source" target="_blank">$source</a></p></div>`;
    $.ajax({
        method: 'GET',
        url: 'filelist.json',
        success: function (d) {
            ajaxResult.push(d);
            for (var i = 0; i < d.length; i++) {
                $('#IssueIndex').append(ArticleInfo.tpl({
                    url: d[i].url,
                    label: d[i].label,
                    author: d[i].author,
                    issued: d[i].issued,
                    source: d[i].source
                }));
            }
        },
        error: function () {
            alert('No document to show')
        }
    });
}

function load(file) {
    $('#file').empty();
    $('#metadataViewer').empty();
    $('#paginationLinks').css('display', 'block');
    $('.coverLink').css('display', 'block');
    $.ajax({
        method: 'GET',
        url: 'metadata_viewer.html',
        success: function (d) {
            $('#metadataViewer').html(d);
            $.ajax({
                method: 'GET',
                url: file,
                success: function (d) {
                    $('#file').html(d);
                    getPrevious(file);
                    getNext(file);
                    addIds();
                    fillInfo('#file', '#info');
                    fillTabs();
                },
                error: function () {
                    alert('Could not load ' + file)
                }
            });
        },
        error: function () {
            alert('Could not load selected article')
        }
    });
}
function getPrevious(file) {
    $('#paginationLinks .previous').removeAttr('style');
    for (var i = 0; i < ajaxResult.length; i++) {
        console.log(ajaxResult[i].url)
        console.log(file)
        if (ajaxResult[i].url == file) {
            if (i - 1 >= 0) {
                var prev_file = ajaxResult[i - 1].url;
                $('#paginationLinks .previous').on("click", function () {
                    load(prev_file);
                });
            }
            else {
                $('#paginationLinks .previous').css('display', 'none');
            }
        }
    }
}

function getNext(file) {
    $('#paginationLinks .next').removeAttr('style');
    for (var i = 0; i < ajaxResult.length; i++) {
        if (ajaxResult[i].url == file) {
            if (i + 1 < ajaxResult.length) {
                var next_file = ajaxResult[i + 1].url;
                $('#paginationLinks .next').on("click", function () {
                    load(next_file);
                });
            }
            else {
                $('#paginationLinks .next').css('display', 'none');
            }
        }
    }
}
function addIds() {
    addId('#file .person', 'person')
    addId('#file .place', 'place')
    addId('#file .entity', 'thing')
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
				<p class="list $name"><b>$label: </b> $content</p>	
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
    fillVisualContentTab({"#file figure": "figure", "#file table": "table"}, '#visual' )
    fillIndex({"#file .person":"person", "#file .place": "place", "#file .entity" : "thing"}, "#entities")
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
    var listItem = `<li class="list $style"><a href="#occurrences" onclick="fillOccurrenceTab('$what', 'occurrence', '#occurrences')">$content</a> ($num)</li>`;
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
                    var className = currName.split(' ').join('-').replace(/\./g, '');
                    elements[i].classList.add(className);
                    if (!(currName in namedict)) {
                        namedict[currName] = 0;
                    }

                    namedict[currName]++;
                }
                var arrOfArrays = Object.entries(namedict).sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
                for (const [key, value] of arrOfArrays) {
                    var className = key.split(' ').join('-').replace(/\./g, '');
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
    $(where + ' h5').append(elements[0].innerHTML);
    for (var i = 0; i < elements.length; i++) {
        $(where + ' ul').append(list.tpl({
            style: style,
            place: '#' + elements[i].id,
            content: elements[i].innerHTML
        }));
    }
    $('#wikiLink').empty();
    var wikiName = elements[0].innerHTML.split(' ').join('_').replace(/\./g, '');
    $('#wikiLink').attr('href', 'https://en.wikipedia.org/wiki/' + wikiName);
    $('#wikiLink').html('Search ' + elements[0].innerHTML + ' on Wikipedia');
}

function goto(id) {
    if ( $(window).width() < 768 ) {
        closeNav()
    }
    $('html, body').animate({
        scrollTop: $(id).offset().top - 70
    }, 200);
    $(id).addClass('animate');
    setTimeout(function () {
        $(id).removeClass('animate');
    }, 5000);
}