const stride = { s: "Spoofing", t: "Tampering", r: "Repudiation", i: "Information Leakage", d: "Denial of Service", e: "Escalation of Privilege" };
const stride_ids = { s: '#spoofing', t: '#tampering', r: '#repudiation', i: '#information', d: '#dos', e: '#escalation' };
const controls_ids = {
    policies: '#policies',
    organization: '#organization',
    hr: '#hr',
    asset: '#asset',
    access: '#access',
    cryptography: '#cryptography',
    physical: '#physical',
    operations: '#operations',
    comms: '#comms',
    system: '#system',
    supplier: '#supplier',
    incident: '#incident',
    continuity: '#continuity',
    compliance: '#compliance'
};
const controls = {
    policies: "Policies",
    organization: "Organization",
    hr: "Human Resources",
    asset: "Asset Management",
    access: "Access Control",
    cryptography: "Cryptography",
    physical: "Physical Security",
    operations: "Operations",
    comms: "Communications",
    system: "System acquisition, develop. and maint.",
    supplier: "Supplier Relations",
    incident: "Incident Management",
    continuity: "Business Continuity",
    compliance: "Compliance"
};

var db = [];


$(function() {
    $("#option-movie").click(function() {
        $("#element-type").html("<h2>Movies</h2>");
    });

    $("#option-event").click(function() {
        $("#element-type").html("<h2>Events</h2>");
    });
    console.log("ready!");
    initWithAllMovies();
    $("#search").click(function() {
        var stride_keywords = [];
        var keysStride = Object.keys(stride_ids);
        for (var i = 0; i < keysStride.length; i++) {
            if ($(stride_ids[keysStride[i]]).is(":checked")) {
                stride_keywords.push(stride[keysStride[i]]);
                stride_keywords.push(stride[keysStride[i]].toLowerCase());
            }
        }
        var controls_keywords = [];
        var keysControls = Object.keys(controls_ids);
        for (var i = 0; i < keysControls.length; i++) {
            if ($(controls_ids[keysControls[i]]).is(":checked")) {
                controls_keywords.push(controls[keysControls[i]]);
                controls_keywords.push(controls[keysControls[i]].toLowerCase());
            }
        }
        var keywords = $("#search-field").val().split(" ");
        filerEventsInMovies(keywords, stride_keywords, controls_keywords);
    });

    $("#clear").click(function() {
        $("#search-field").val("");
        var stride_keywords = [];
        var keysStride = Object.keys(stride_ids);
        for (var i = 0; i < keysStride.length; i++) {
            $(stride_ids[keysStride[i]]).prop('checked', false);
        }
        var controls_keywords = [];
        var keysControls = Object.keys(controls_ids);
        for (var i = 0; i < keysControls.length; i++) {
            $(controls_ids[keysControls[i]]).prop('checked', false);
        }
        var numberMovies = db.length;
        for (var j = 0; j < numberMovies; j++) {
            var elems = $('#movie' + j.toString()).find(".scene");
            elems.show();
            $('#itemsmovie' + j.toString()).html("(" + elems.length + " cards)");
        }
    });
});

function filerEventsInMovies(keywords, stride_kw, controls_kw) {
    var numberMovies = db.length;
    for (var j = 0; j < numberMovies; j++) {
        var elems = $('#movie' + j.toString()).find(".scene");
        var KeywordArr = keywords.concat(stride_kw).concat(controls_kw);
        KeywordArr = KeywordArr.filter(e => e !== "");
        console.log(KeywordArr);
        var res = $();
        for (var i = 0; i < KeywordArr.length; i++) {
            res = res.add(elems.filter(":contains('" + KeywordArr[i] + "')"));
        }
        var new_size = res.length;
        $('#itemsmovie' + j.toString()).html("(" + new_size + " cards)");
        elems.not(res).hide();
    }
}

function initWithAllMovies() {
    const file = 'movies/list.json';
    $.ajax({
        url: file,
        dataType: 'json',
        async: false,
        success: function(json) {
            //load data for each movie
            var arrayLength = json.length;
            for (var i = 0; i < arrayLength; i++) {
                $.ajax({
                    url: 'movies/' + json[i],
                    dataType: 'json',
                    async: false,
                    success: function(json2) {
                        var movie = {
                            title: json2["title"],
                            events: json2["events"]
                        };
                        db[i] = movie;
                    }
                });
            }
            redrawMoviesUI(db);
        }
    });
}

function redrawMoviesUI(rows) {
    console.log(rows);
    var rowsLength = rows.length;
    for (var i = 0; i < rowsLength; i++) {
        movie = rows[i];
        var movieCard = "";
        var movieEvents = movie["events"];
        var eventsLength = movieEvents.length;
        var preMovieCard = ['<div class="card border-light mb-3">',
            '<div class="card-header-sm" id="heading' + i.toString() + '">',
            '<h5><button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse' + i.toString() + '" aria-expanded="true" aria-controls="collapse' + i.toString() + '">',
            movie["title"],
            '<span id="itemsmovie' + i.toString() + '"> (' + eventsLength + ' cards)</span>',
            '</button></h5>',
            '</div>',
            '<div id="collapse' + i.toString() + '" class="collapse" aria-labelledby="heading' + i.toString() + '" data-parent="#accordionExample">',
            '<div class="card-body" id="movie' + i.toString() + '">'
        ].join("\n");
        for (var j = 0; j < eventsLength; j++) {
            movieCard = movieCard + generateEvent(movieEvents[j]);
        }
        var postMovieCard = '</div>' + '</div>';
        $("#results").append(preMovieCard + movieCard + postMovieCard);
    }
}

function generateEvent(event) {

    var timeBody = ['<div class="row">',
        '<div class="column mr-3">',
        '<label class="font-weight-bold" for="time">Time</label>',
        '</div>',
        '<div class="column">',
        'Minute ' + event["time_min"].toString() + ' (' + event["duration"].toString() + ' minutes)',
        '</div>',
        '</div>'
    ].join("\n");
    var sceneBody = ['<div class="row">',
        '<div class="column mr-3">',
        '<label class="font-weight-bold" for="scene">Scene</label>',
        '</div>',
        '<div class="column">',
        event["description"],
        '</div>',
        '</div>'
    ].join("\n");
    var strideBody = generateSTRIDE(event["stride"]);
    var controlsBody = generateISOControls(event["isocontrols"]);
    var partiesBody = generateParties(event["parties"]);
    var discussionBody = ['<div class="row">',
        '<div class="column mr-3">',
        '<label class="font-weight-bold" for="scene">Discussion</label>',
        '</div>',
        '<div class="column">',
        event["discussion"],
        '</div>',
        '</div>'
    ].join("\n");
    var cardBody = ['<div class="card-body scene">',
        timeBody,
        sceneBody,
        strideBody,
        controlsBody,
        partiesBody,
        discussionBody,
        '</div>'
    ].join("\n");

    var card = ['<div class="card">',
        cardBody,
        '</div>'
    ].join("\n");
    return card;
}

function generateSTRIDE(strideArray) {
    var strideLength = strideArray.length;
    var strideButtonsBody = "";
    for (var i = 0; i < strideLength; i++) {
        if (strideArray[i] !== "-") {
            strideButtonsBody = strideButtonsBody.concat('<button type="button" class="btn btn-warning active btn-sm mr-1">' + stride[strideArray[i]] + '</button>');
        }
    }
    if (strideButtonsBody === "") {
        strideButtonsBody = "None";
    }
    var strideBody = ['<div class="row mb-1">',
        '<div class="column mr-3">',
        '<label class="font-weight-bold" for="time">STRIDE</label>',
        '</div>',
        '<div class="column stride">',
        strideButtonsBody,
        '</div>',
        '</div>'
    ].join("\n");
    return strideBody;
}

function generateISOControls(controlsArray) {

    var controlsLength = controlsArray.length;
    var controlsButtonsBody = "";
    for (var i = 0; i < controlsLength; i++) {
        if (controlsArray[i] !== "-") {
            controlsButtonsBody = controlsButtonsBody.concat('<button type="button" class="btn btn-info active btn-sm mr-1">' + controls[controlsArray[i]] + '</button>');
        }
    }
    if (controlsButtonsBody === "") {
        controlsButtonsBody = "None";
    }
    var controlsBody = ['<div class="row mb-1">',
        '<div class="column mr-3">',
        '<label class="font-weight-bold" for="time">ISO CONTROLS</label>',
        '</div>',
        '<div class="column isocontrols">',
        controlsButtonsBody,
        '</div>',
        '</div>'
    ].join("\n");
    return controlsBody;
}

function generateParties(partiesArray) {
    var partiesLength = partiesArray.length;
    var partiesButtonsBody = "";
    for (var i = 0; i < partiesLength; i++) {
        if (partiesArray[i][0] !== "") {
            var partiesButton = '<button type="button" class="btn btn-secondary active btn-sm mr-1">' + partiesArray[i][1] + '</button>';
            if (partiesArray[i][1] === "Positive" || partiesArray[i][1] === "Very Positive") {
                partiesButton = '<button type="button" class="btn btn-success active btn-sm mr-1">' + partiesArray[i][1] + '</button>';
            } else if (partiesArray[i][1] === "Negative" || partiesArray[i][1] === "Very Negative") {
                partiesButton = '<button type="button" class="btn btn-danger active btn-sm mr-1">' + partiesArray[i][1] + '</button>';
            }
            var thisParty = ['<div class="row mb-2">',
                '<label class="mr-2" for="time">',
                partiesArray[i][0],
                '</label>',
                partiesButton,
                '</div>'
            ].join("\n");
            partiesButtonsBody = partiesButtonsBody.concat(thisParty);
        }
    }
    var partiesBody = ['<div class="row mb-1">',
        '<div class="column mr-3">',
        '<label class="font-weight-bold" for="time">Parties</label>',
        '</div>',
        '</div>',

        partiesButtonsBody
    ].join("\n");
    return partiesBody;
}