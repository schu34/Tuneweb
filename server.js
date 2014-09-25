var http = require('http');

var express = require('express');
var app = express();

//so we can parse requests from client
var bodyParser = require('body-parser');

//module for querying echonest
var echo = require('./echo');

//for making requests
var request = require('request');

//use the client directory by default
app.use(express.static(__dirname + "/client"));
//tell the app to use body parser
app.use(bodyParser.urlencoded({extended:false}));
//create the server
http.createServer(app).listen(3000);

//set up the /artist path
app.post("/artist", function(req, res) {
    var artist = req.body.artist;

    echo.getRelatedArtists(artist, 5, function(r){
      //send reasults back to client
      res.send(r);
    });
});

console.log("server listeining on port 3000");
