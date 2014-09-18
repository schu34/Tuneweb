var http = require('http');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var echo = require('./echo');

var request = require('request');


app.use(express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({extended:false}));
http.createServer(app).listen(3000);


app.post("/artist", function(req, res) {
    var artist = req.body.artist;
    echo.getRelatedArtists(artist, 5, function(r){
      console.log(r);
      res.send(r);
    });

    //console.log("sending " + relatedArtists + " to client");

    /*res.contentType = ('json');
    res.send(relatedArtists);*/
    //console.log("request for artist recieved")
});

console.log("server listeining on port 3000");

var getRelatedArtists = function(artist){
  url = "http://developer.echonest.com/api/v4/artist/similar?api_key=909HQJYZBYPA4XWIV&name=radiohead&format=json&results=5";
  console.log("getting artists related to " + artist);

  echo.getRelatedArtists(artist, 5);
};
