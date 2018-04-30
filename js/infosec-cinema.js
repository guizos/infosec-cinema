

var remoteCouch = false;



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
    var file = 'list.json'
    fs.readFile(file, (err, data) => {
        if (err && err.code === "ENOENT") {
            // But the file might not yet exist.  If so, just write the object and bail
            return fs.writeFile(file, JSON.stringify([obj]), error => console.error);
        } else if (err) {
            // Some other error
            console.error(err);
        }
        // 2. Otherwise, get its JSON content
        else {
            try {
                const movie_list = JSON.parse(data);

                //load data for each movie
                var arrayLength = movie_list.length;
                for (var i = 0; i < arrayLength; i++) {
                    console.log(movie_list[i]);
                    //Do something
                    //addMovie(movie_list[i]);
                }
            } catch (exception) {
                console.error(exception);
            }
        }
    });
  }

  function filter(){

  }


