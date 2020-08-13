
$("#styles").change(function {
    var selectedStyle = $(this). children("option:selected").val();
    $("#css").html("");
    $("#css").load('' + selectedStyle + '.css');
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
            $('#file').html(d)
            $('#title').html($('#file h1'))
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
    addId('#file .entity', 'entity')
    addId('#file .concept', 'entity')
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
    fillVisualContentTab('#file figure', 'figure', '#figures')
    fillVisualContentTab('#file table', 'table', '#tables')
    fillVisualContentTab('#file .aside', 'aside', '#asides')
    createRightPane('person', '#right')
    createRightPane('place', '#right')
    createRightPane('entity', '#right')
    createRightPane('concept', '#right')
}

function fillToCTab(what, style, where) {
    var listItem = `<li class="list $style"><a href="#" onclick="goto('$place')">$content</a></li>`;
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


function fillVisualContentTab(what, style, where) {
    var listItem = `<li class="list $style"><a href="#" onclick="goto('$place')">$content</a></li>`;
    var elements = $(what);
    var id = '1';
    if ($(what).length) {
        for (var i = 0; i < elements.length; i++) {
            $(where + ' ul').append(listItem.tpl({
                style: style,
                place: '#' + elements[i].id,
                content: style[0].toUpperCase() + style.slice(1) + ' ' + id++ + '.'
            }));
        }
    }
    else {
        $(where + '-tab').remove();
        $(where).remove();
    }
}


function createRightPane(what, where) {
    var navTabTpl = `<li class="nav-item"><a class="nav-link" id="$whats-tab" data-toggle="tab" href="#$whats" role="tab" aria-controls="view" aria-selected="true">$title</a></li> `;
    var tabContentTpl = `<div class="tab-pane myBorder myBorder-notop" id="$whats" role="tabpanel" aria-labelledby="$whats-tab"><ul class="minimal"></ul></div>`;
    if ($('#file .' + what).length) {
        $(where + 'Tab').append(navTabTpl.tpl({
            what: what,
            title: what[0].toUpperCase() + what.slice(1)
        }));
        $(where + 'Content').append(tabContentTpl.tpl({
            what: what,
        }));
        fillIndex('#file .' + what, what, '#' + what + 's');
    }
}

function fillIndex(what, style, where) {
    var listItem = `<li class="list $style"><a href="#occurrences" onclick="fillOccurrenceTab('$what', 'occurrence', '#occurrences')">$content</a> ($num)</li>`;
    var elements = $(what);
    var namedict = {};
    for (var i = 0; i < elements.length; i++) {
        var currName = elements[i].innerText;
        var className = currName.split(' ').join('-').replace(/\./g, '');
        elements[i].classList.add(className);
        if (!(currName in namedict)) {
            namedict[currName] = 0;
        }

        namedict[currName]++;
        console.log(className);
    }
    var arrOfArrays = Object.entries(namedict).sort((a, b) => parseInt(b[1]) - parseInt(a[1]));
    for (const [key, value] of arrOfArrays) {
        var className1 = key.split(' ').join('-').replace(/\./g, '');
        $(where + " ul").append(listItem.tpl({
            content: String(key),
            num: String(value),
            what: '#file .' + className1,
            style: style,
        }
        ));
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