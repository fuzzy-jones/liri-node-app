require("dotenv").config();

// the npm requires for twitter and spotify
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

// require the exports from the keys.js and store in var 
var keys = require("./keys");

// make a require request for omdb
// do fs request

// 
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// store the value of the 3rd arg in the var called command
var command = process.argv[2];

// create var's for each of the 4 command options
var myTweets = "my-tweets";
var spotifySong = "spotify-this-song";
var movieThis = "movie-this";
var doIt = "do-what-it-says";

// using the twitter package to search for the twitter account I created and access that tweets from the account
client.get('search/tweets', {q: 'UNCCBCfuzzy'}, function(error, tweets, response) {
    // store the data statuses in a new var
    var theTweets = tweets.statuses;
    // if the command for 3rd arg is 'my-tweets' console loge the tweets, else do nothing
    if (command === myTweets) {
        for (var i = 0; i < theTweets.length; i++) {
        console.log(theTweets[i].text);
        }  
    } else {
        return;
    }
});