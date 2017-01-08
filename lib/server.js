var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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
var AsyncTree = require("./AsyncTree.js");


//use the public directory by default
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
http.createServer(app).listen(3000);

//set up the /artist path
app.post("/artist", function(req, res) {
    var artist = req.body.artist;
    var layers = req.body.layers || 2;
    var artistsPerLayer = req.body.artistsPerLayer || 5;
    var tree = new AsyncTree(artist, getChildren, layers).init().then(function(tree){
        var graph = new Graph().graphFromTree(tree.root);
        res.send(graph);
    }, function(err){
        console.error(err);
        console.error(" in: " + err.fileName + " at: " + err.lineNumber);
        //throw err;
    });

    function getChildren(artist){
        return getRelated(artist, artistsPerLayer);
    }
});



function getRelated(artist, numToGet) {
    return lastfm.requestPromise("artist.getSimilar", {
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
