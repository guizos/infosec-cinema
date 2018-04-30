

$(function() {
    console.log( "ready!" );
    addAllMovies();
});

function addMovie(file) {
    const movie_json = JSON.parse(file);
    
    var movie = {
      _id: new Date().toISOString(),
      title: file,
      completed: false
    };
    db.put(todo, function callback(err, result) {
      if (!err) {
        console.log('Successfully posted a todo!');
      }
    });
  }

  function addAllMovies() {
    const file = 'movies/list.json'
    $.getJSON(file, function(json) {
        console.log(json); // this will show the info it in firebug console
        //load data for each movie
        var arrayLength = movie_list.length;
        for (var i = 0; i < arrayLength; i++) {
            console.log(movie_list[i]);
            //Do something
            //addMovie(movie_list[i]);
        }
    });
  }

  function filter(){

  }


