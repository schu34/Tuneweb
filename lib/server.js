var http = require('http');

var express = require('express');
var app = express();

//so we can parse requests from client
var bodyParser = require('body-parser');

//module for querying lastfm
var LastFmNode = require('lastfm').LastFmNode;

var lastfm = new LastFmNode({
  api_key: /*your_api_key*/ ,   // sign-up for a key at http://www.last.fm/api
  secret: /*your_shared_secret*/,
});

//use the public directory by default
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));
http.createServer(app).listen(3000);

//set up the /artist path
app.post("/artist", function(req, res) {
    var artist = req.body.artist;
    console.log("artist: " + artist);
    lastfm.request("artist.getSimilar", {
      artist: artist,
      limit: 5,
      handlers: {
        success: function(data){
          console.log(JSON.stringify(data));
          artists = data.similarartists.artist
          res.send(artists);

        },
        error: function(error){
          console.log(error);
        }
      }
    })
});

console.log("server listeining on port 3000");
