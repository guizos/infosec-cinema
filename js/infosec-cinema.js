var PouchDB = require('pouchdb');

var db = new PouchDB('movies');

$(function () {
    $("#option-movie").click(function () {
        $("#element-type").html("<h2>Movies</h2>");
    });

    $("#option-event").click(function () {
        $("#element-type").html("<h2>Events</h2>");
    });
    console.log("ready!");
    addAllMovies();
    var search_field = $("#search-field").val();
    loadForSearchField(search_field);


    $("#clear").click(function () {
        $("#search-field").val("");
        loadForSearchField("");
    });
});



function addMovie(file) {
    $.getJSON(file, function (json) {
        console.log(json["title"])
        var movie = {
            _id: json["title"],
            title: json["title"],
            events: json["events"]
        };
        db.put(movie, function callback(err, result) {
            if (!err) {
                console.log('Successfully posted a film!');
            }
        });
    });

}

function addAllMovies() {
    const file = 'movies/list.json'
    $.getJSON(file, function (json) {
        //load data for each movie
        var arrayLength = json.length;
        for (var i = 0; i < arrayLength; i++) {
            addMovie('movies/' + json[i]);
        }
    });
}

function loadForSearchField(text){
    if (text == ""){
        db.allDocs({include_docs: true, descending: true}, function(err, doc) {
            redrawMoviesUI(doc.rows);
          });
    }else{

    }

}

function redrawMoviesUI(rows) {
    var rowsLength = rows.length;
        for (var i = 0; i < rowsLength; i++) {
            movie = rows[i].doc
            var preMovieCard = ['<div class="card border-light mb-3">',
            '<div class="card-header-sm" id="heading'+i.toString()+'">',
                '<h5><button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapse'+i.toString()+'" aria-expanded="true" aria-controls="collapse'+i.toString()+'">',
                    movie["title"],
                '</button></h5>',
            '</div>',
            '<div id="collapse'+i.toString()+'" class="collapse" aria-labelledby="heading'+i.toString()+'" data-parent="#accordionExample">',
                '<div class="card-body">'].join("\n");
            var movieCard = "";
            var movieEvents = movie["events"]
            var eventsLength = movieEvents.length;
            for (var j = 0; j < eventsLength; j++){
                movieCard = movieCard + generateEvent(movieEvents[j]);
            }
            var postMovieCard = '</div>'+'</div>';
            $( "#results" ).append(preMovieCard+movieCard+postMovieCard);
        }
}

function generateEvent(event){

    var timeBody = ['<div class="row">',
                        '<div class="column mr-3">',
                            '<label class="font-weight-bold" for="time">Time</label>',
                        '</div>',    
                        '<div class="column">',
                            'Minute '+event["time_min"].toString()+' ('+event["duration"].toString()+' minutes)',
                        '</div>',
                    '</div>'].join("\n");
    var sceneBody = ['<div class="row">',
                    '<div class="column mr-3">',
                        '<label class="font-weight-bold" for="scene">Scene</label>',
                    '</div>',    
                    '<div class="column">',
                        event["description"],
                    '</div>',
                '</div>'].join("\n");
    var strideBody = generateSTRIDE(event["stride"]);
    var cardBody = ['<div class="card-body">',
                    timeBody, 
                    sceneBody,
                    strideBody,
                    '</div>'].join("\n");

    var card = ['<div class="card">',
                    cardBody,
                '</div>'].join("\n");
    return card;
}

function generateSTRIDE(strideArray){
    const stride= {s: "Spoofing", t:"Tampering", r:"Repudiation", i:"Information Leakage", d:"Denial of Service", e:"Escalation of Privilege"};
    var strideLength = strideArray.length;    
    var strideButtonsBody = "";
    for (var i = 0; i < strideLength; i++){
        if (strideArray[i] !== "-"){
            strideButtonsBody = strideButtonsBody.concat('<button type="button" class="btn btn-danger active btn-sm mr-1">'+stride[strideArray[i]]+'</button>');
        }
    }
    if (strideButtonsBody === ""){
        strideButtonsBody = "None";
    }
    var strideBody = ['<div class="row">',
                        '<div class="column mr-3">',
                            '<label class="font-weight-bold" for="time">STRIDE</label>',
                        '</div>',    
                        '<div class="column">',
                        strideButtonsBody,
                        '</div>',
                    '</div>'].join("\n");
    console.log(strideButtonsBody);
    return strideBody;
}
