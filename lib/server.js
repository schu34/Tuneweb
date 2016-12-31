var http = require('http');
var express = require('express');
var app = express();
//so we can parse requests from client
var bodyParser = require('body-parser');
//module for querying lastfm
var jsonFile = require('jsonfile');
var LastfmPromise = require("./LastfmPromise.js");
var file = 'keys.json';

jsonFile.readFile(file, function(err, obj) {
    if (err) {
        console.log("It seems like you forgot to create keys.json. see readme for more info");
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
    console.log(req.body.artist);
    lastfm.requestPromise("artist.getSimilar", {
        artist: artist,
        limit: 5
    }).then(function(val){
        console.log(val);
        artists = val.similarartists.artist.map(function(a){return a.name});
        res.send(new Graph().newGraph(artist, artists));
        //console.log(val);
        //return buildGraph(val)
    },
    function(err){
        res.send("there was an error: " + err);
        console.log(err);
    });
});

// function buildGraph(artist, layers){
//     var graph = new Graph();
//     graph.newGraph(artist, artists);
//     for (var i = 0; i < aritsts.length; i++) {
//         lastfm.request("artist.getsimilar", {
//             artist: artist,
//             limit: 5,
//             handlers{
//                 success: addToGraph,
//                 error: throwErr;
//             }
//         })
//     }
//     function addToGraph(data){
//         var newArtists = data.map(function(a){return a.name;});
//     }
// }
//
// function getRelated()

function throwErr(err){
    throw err;
}


console.log("server listeining on port 3000");
