var http = require('http');
var express = require('express');
var app = express();
//so we can parse requests from client
var bodyParser = require('body-parser');
//module for querying lastfm
var LastFmNode = require('lastfm').LastFmNode;
var jsonFile = require('jsonfile');
var lastfm;
var file = 'keys.json';

jsonFile.readFile(file, function(err, obj) {
    if (err) {
        console.log("It seems like you forgot to create keys.json. see readme for more info");
        throw err;
    }
    lastfm = new LastFmNode({
        api_key: obj.api_key, // sign-up for a key at http://www.last.fm/api
        secret: obj.secret
    });
})

var Graph = require("./graph.js");


//use the public directory by default
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
http.createServer(app).listen(3000);

//set up the /artist path
app.post("/artist", function(req, res) {
    var artist = req.body.artist;
    lastfm.request("artist.getSimilar", {
        artist: artist,
        limit: 5,
        handlers: {
            success: function(data) {
                var artists = data.similarartists.artist
                var graph = new Graph();
                artists = artists.map(function(a){return a.name;})
                graph.newGraph(artist, artists);
                res.send(graph);

            },
            error: function(error) {
                throw error;
            }
        }
    })
});

console.log("server listeining on port 3000");
