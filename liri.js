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
var songOrMovieName = "";
// Loop through all the words in the node argument at process.arv[3] and beyond for songs and movies that are longer than one word, and chain together with +'s
for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    songOrMovieName = songOrMovieName + "+" + nodeArgs[i];
  } else {
    songOrMovieName += nodeArgs[i];
  }
};

// create var's for each of the 4 command options
var myTweets = "my-tweets";
var spotifySong = "spotify-this-song";
var movieThis = "movie-this";
var doIt = "do-what-it-says";

// default song if no song name is passed in the command line
var defaultSong = "the+sign+ace+of+base";
// default movie is no movie name is passed in the command line
var defaultMovie = "mr+nobody";

// function the run the twitter request when requirements are met in the runRequest function if statements
function twitterRequest() {
    // using the twitter package to search for the twitter account and access that tweets from the account
    client.get('statuses/user_timeline', {screen_name: 'UNCCBCfuzzy'}, function(error, tweets, response) {
        // the assignment says to display for 20 recent tweets, but I only have 5 tweets and length of 20 was causing error, so I did it for length
        for (var i = 0; i < tweets.length; i++) {
        console.log("--"+tweets[i].text);
        }   
    });
};

// function the run the spotify request when requirements are met in the runRequest function if statements
function spotifyRequest() {
    spotify.search({ type: 'track', query: songOrMovieName, limit: 1 }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }
        // targeting the data in the object up until where the date I want located to shorten up the console log
        var theSpotify = data.tracks.items[0];
        // not sure what the null and 2 mean, but console logging the necessary data from the json object
        console.log(JSON.stringify("Artist: " + theSpotify.album.artists[0].name, null, 2));
        console.log(JSON.stringify("Song: " + theSpotify.name, null, 2));
        console.log(JSON.stringify("URL: " + theSpotify.external_urls.spotify, null, 2));
        console.log(JSON.stringify("Album: " + theSpotify.album.name, null, 2));   
    });
};

// function the run the omdb request when requirements are met in the runRequest function if statements
function omdbRequest() {
    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t="+songOrMovieName+"&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // Parse the body of the site and recover the data desired from the json object
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors); 
        }  
    });
};

// function the run the fs request when requirements are met in the runRequest function if statements
function fsRequest() {
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
        songOrMovieName = thatWay;
        spotifyRequest();
    });
}

// function to run appropriate above functions according to the conditions met in the if statements
function runRequests() {
    // if the command for 3rd arg is 'my-tweets' console loge the tweets, else do nothing
    if (command === myTweets) {
        twitterRequest();
    // if the command in arg[2] is movie-this and arg[3] is null the default song will be the sign. if statement must be before regular spotify if statement for synchronicity purposes
    } else if (command === spotifySong && process.argv[3] == null) {
        songOrMovieName = defaultSong;
        spotifyRequest();
    } else if (command === spotifySong && songOrMovieName !== undefined) { 
        spotifyRequest();
    // if the command in arg[2] is movie-this and arg[3] is null the default movie name will be Mr. Nobody. if statement must be before regular omdb if statement for synchronicity purposes
    } else if (command === movieThis && process.argv[3] == null) {
        songOrMovieName = defaultMovie;
        omdbRequest();
    } else if (command === movieThis && songOrMovieName !== undefined) {
        omdbRequest();
    } else if (command === doIt) {
        fsRequest();
    } else {
        return;
    }
};

// run the function for the requests based on the if statements
runRequests();
