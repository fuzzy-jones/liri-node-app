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
var songName = "'"+process.argv[3]+"'";
// need to listen for multiple words in arg

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

spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
    var theSpotify = data.tracks.items[0];
    if (command === spotifySong) {
        // not sure what the null and 2 mean
        console.log(JSON.stringify("Artist: " + theSpotify.album.artists[0].name, null, 2));
        console.log(JSON.stringify("Song: " + theSpotify.name, null, 2));
        console.log(JSON.stringify("URL: " + theSpotify.album.external_urls.spotify, null, 2));
        console.log(JSON.stringify("Album: " + theSpotify.album.name, null, 2));
    } else {
        return;
    }
});

//   Artist(s)
//   The song's name
//   A preview link of the song from Spotify
//   The album that the song is from