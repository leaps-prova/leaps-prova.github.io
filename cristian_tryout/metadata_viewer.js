
$("#styles").change(function() {
    var selectedStyle = $(this).children("option:selected").val();
    $("#ArticleCss").html("");
    $("#ArticleCss").load('' + selectedStyle + '.css');
});




String.prototype.tpl = function (o) {
    var r = this;
    for (var i in o) {
        r = r.replace(new RegExp("\\$" + i, 'g'), o[i])
    }
    return r
}
$(document).ready(main);

function main() {
    $.ajax({
        method: 'GET',
        url: 'article.html',
        success: function (d) {
            $('#file').html(d);
            addIds()
            fillInfo('#file', '#info')
            fillTabs()
        },
        error: function () {
            alert('Could not load file texts2020 / RollerStone / roller - stone.html')
        }
    });
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
				<p class="list title"><b>Title: </b> $title</p>
				<p class="list author"><b>Author: </b> $author</p>
				<p class="list date"><b>Date: </b> $issued</p>
				<p class="list publisher"><b>Publisher: </b> $publisher</p>
				<p class="list identifier"><b>Identifier: </b> $identifier</p>	
				<p class="list bibiographicCitation"><b>bibiographic Citation: </b> $bibiographicCitation</p>		
				` ;
    var title = $(from + ' meta[name="DC.title"]').attr("content");
    var authorsList = $(from + ' meta[name="DC.creator"]');
    var issued = $(from + ' meta[name="DCTERMS.issued"]').attr("content");
    var publishersList = $(from + ' meta[name="DC.publisher"]');
    var identifier = $(from + ' meta[name="DC.identifier"]').attr("content");
    var bibiographicCitation = $(from + ' meta[name="DCTERMS.bibliographicCitation"]').attr("content");
    var authors = "";
    var publishers = "";
    for (var i = 0; typeof (authorsList[i]) != 'undefined';
        authors += "<li class='small'>" + authorsList[i++].getAttribute('content'))+"</li>";
    for (var i = 0; typeof (publishersList[i]) != 'undefined';
        publishers += "<li class='small'>" + publishersList[i++].getAttribute('content'))+"</li>";
    $(where).append(item.tpl({
        author: authors,
        title: title,
        issued: issued,
        publisher: publishers,
        identifier: identifier,
        bibiographicCitation: bibiographicCitation
    }));
}

function fillTabs() {
    fillToCTab('#file h2', 'heading', '#toc')
    fillVisualContentTab('#ArticleBody figure', 'figure', '#figures')
    fillVisualContentTab('#file table', 'table', '#tables')
    fillIndex('#file .person', 'person', '#persons')
    fillIndex('#file .place', 'place', '#places')
    fillIndex('#file .entity', 'thing', '#things')
}

function fillToCTab(what, style, where) {
    var listItem = `<li class="list $style"><a href="#" onclick="goto('$place')">$content</a></li>`;
    var elements = $(what);
    for (var i = 0; i < elements.length; i++) {
        $(where + ' ul').append(listItem.tpl({
            style: style,
            place: '#' + elements[i].id,
            content: elements[i].innerHTML
        }));
    }
}


function fillVisualContentTab(what, style, where) {
    var visualItem = `<div class="$what-wrapper"><$what class="$what-widget">$content</$what></div>`;
    var elements = $(what);
    if ($(what).length) {
        for (var i = 0; i < elements.length; i++) {
            $(where).append(visualItem.tpl({
                what: style,
                content: elements[i].innerHTML
            }));
        }
    }
    else {
        $(where).remove();
    }
}

function fillIndex(what, style, where) {
    var listItem = `<li class="list $style"><a href="#occurrences" onclick="fillOccurrenceTab('$what', 'occurrence', '#occurrences')">$content</a> ($num)</li>`;
    var elements = $(what);
    if ($(what).length) {
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
            $(where + " ul").append(listItem.tpl({
                content: String(key),
                num: String(value),
                what: '#file .' + className,
                style: style,
            }));
        }
    }
    else {
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
    $('.nav-tabs a[href="#file"]').tab('show');
    $('html, body').animate({
        scrollTop: $(id).offset().top - 70
    }, 200);
    $(id).addClass('animate');
    setTimeout(function () {
        $(id).removeClass('animate');
    }, 5000);
}