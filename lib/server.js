var http = require('http');
var express = require('express');
var app = express();
//so we can parse requests from client
var bodyParser = require('body-parser');
//module for querying lastfm
var jsonFile = require('jsonfile');
var LastfmPromise = require("./LastfmPromise.js");
var file = 'keys.json';
var lastfm;

jsonFile.readFile(file, function(err, obj) {
    if (err) {
        //console.log("It seems like you forgot to create keys.json. see readme for more info");
        throw err;
    }
    lastfm = new LastfmPromise({
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
    var layers = req.body.layers || 3;
    var artistsPerLayer = req.body.artistsPerLayer || 5;
    buildGraph(artist, layers, artistsPerLayer).then(function(graph) {
        res.send(graph);
    });
});

function buildGraph(artist, layers, artistsPerLayer) {

    var graph = new Graph();

    var artistQueue = [];
    return getRelated(artist, artistsPerLayer)
    .then(function(artists) {
        graph.newGraph(artist, artists);
        artistQueue = artistQueue.concat(artists.map(function(a) {
            return {
                name: a,
                depth: 1
            };
        }));
    }).then(function(){
        var promiseQueue = artistQueue.map(function(a){
            return Promise.resolve(a);
        });
        for (var i = 0; i < promiseQueue.length; i++) {
            promiseQueue.append(getRelated(promiseQueue[i], artistsPerLayer))
            .then(function(val){
                promiseQueue.concat(val)
            })
        }
        return Promise.all(promiseQueue)
    }).then(function(){
        //TODO
    });



    //artists = val.similarartists.artist.map(function(a){return a.name});
}



function getRelated(artist, numToGet) {
    return lastfm.request("artists.getSimilar", {
        artist: artist,
        limit: numToGet
    }).then(function(val) {
        return val.similarartists.artist.map(function(a) {
            return a.name
        });
    })
}

function throwErr(err) {
    throw err;
}
