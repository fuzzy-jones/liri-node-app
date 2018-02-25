require("dotenv").config();

// the npm requires for twitter and spotify
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// require the exports from the keys.js and store in var 
var keys = require("./keys");

// make a require request for omdb
var request = require('request');
// node package to read and write files from random.txt for do what-it-is says portion of exercise
var fs = require("fs");

// 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// store the value of the 3rd arg in the var called command
var command = process.argv[2];

// need to listen for multiple words in arg
var nodeArgs = process.argv;
var songName = " ";
// Loop through all the words in the node argument at process.arv[3] and beyond for songs that are longer than one word, and chain together with +'s
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    songName = songName + "+" + nodeArgs[i];
  } else {
    songName += nodeArgs[i];
  }
};
// Loop through all the words in the node argument at process.arv[3] and beyond for movies that are longer than one word, and chain together with +'s
var movieName = "";
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    movieName = movieName + "+" + nodeArgs[i];
  } else {
    movieName += nodeArgs[i];
  }
};

// create var's for each of the 4 command options
var myTweets = "my-tweets";
var spotifySong = "spotify-this-song";
var movieThis = "movie-this";
var doIt = "do-what-it-says";

// default song if no arg is passed in the command line
var defaultSong = "hush";
// default movie is no arg is passed in the command line
var defaultMovie = "hush";


// using the twitter package to search for the twitter account and access that tweets from the account
client.get('search/tweets', {q: 'UNCCBCfuzzy'}, function(error, tweets, response) {
    // store the data statuses in a new var
    var theTweets = tweets.statuses;
    // if the command for 3rd arg is 'my-tweets' console loge the tweets, else do nothing
    if (command === myTweets) {
        for (var i = 0; i < theTweets.length; i++) {
        console.log("-"+theTweets[i].text);
        }  
    } else {
        return;
    }
});


spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
    var theSpotify = data.tracks.items[0];
    if (command === spotifySong && songName !== undefined) {
        // not sure what the null and 2 mean
        console.log(JSON.stringify("Artist: " + theSpotify.album.artists[0].name, null, 2));
        console.log(JSON.stringify("Song: " + theSpotify.name, null, 2));
        console.log(JSON.stringify("URL: " + theSpotify.album.external_urls.spotify, null, 2));
        console.log(JSON.stringify("Album: " + theSpotify.album.name, null, 2));
    } else if (command === doIt) {
        // if command is do-what-it-says then read the txt file and display results for song in file
        fs.readFile("random.txt", "utf8", function(error, data) {
            // If the code experiences any errors it will log the error to the console.
            if (error) {
            return console.log(error);
            }
            // makes it a data array then split it
            var dataArr = data.split(",");
            // store the data in the array for the song name in var thatWay
            var thatWay = dataArr[1];
            songName = thatWay;
            console.log(songName);
            // console.log(JSON.stringify("Artist: " + theSpotify.album.artists[0].name, null, 2));
            // console.log(JSON.stringify("Song: " + theSpotify.name, null, 2));
            // console.log(JSON.stringify("URL: " + theSpotify.album.external_urls.spotify, null, 2));
            // console.log(JSON.stringify("Album: " + theSpotify.album.name, null, 2));
        });
    } else if (command === spotifySong && songName == null) {
        console.log("no song for you");
        // (songName = defaultSong);
        // console.log(songName);
        // console.log(JSON.stringify("Artist: " + theSpotify.album.artists[0].name, null, 2));
        // console.log(JSON.stringify("Song: " + theSpotify.name, null, 2));
        // console.log(JSON.stringify("URL: " + theSpotify.album.external_urls.spotify, null, 2));
        // console.log(JSON.stringify("Album: " + theSpotify.album.name, null, 2));
    } 
    else {
        return;
    }   
});


// Then run a request to the OMDB API with the movie specified
request("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
    
    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200 && command === movieThis && movieName !== undefined) {

        // Parse the body of the site and recover the data desired
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
    } else if (!error && response.statusCode === 200 && command === movieThis && movieName == null) {
        console.log("no movie for you");
        // (movieName = defaultMovie);
        // console.log(movieName);
    } 
    else {
        return;
    }
});


