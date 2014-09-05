var http = require('http');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var echojs = require('echojs');
var echo = echojs({
  key: process.env.ECHONEST_KEY
});

app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({extended:false}));
http.createServer(app).listen(3000);


app.post("/artist", function(req, res) {
    artist = req.body.artist;
    relatedArtists = getRelatedArtists(artist);


    res.contentType = ('json');
    res.send(JSON.stringify(relatedArtists));
    //console.log("request for artist recieved")
});

console.log("server listeining on port 3000");

var getRelatedArtists = function(artist){
  console.log("getting artists related to " + artist);

  ret = echo('artist/similar').get({name:artist}, function(err, json){
    console.log(err);
    console.log(json);
  });

  return ret;
};
