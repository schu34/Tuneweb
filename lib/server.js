var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var apiCache = require("apicache");
var cache = apiCache.middleware;

var jsonFile = require('jsonfile');
var LastfmPromise = require("./LastfmPromise.js");
var file = 'keys.json';
var lastfm;
jsonFile.readFile(file, function(err, obj) {
    if (err) {
        throw err;
    }
    lastfm = new LastfmPromise({
        api_key: obj.api_key, // sign-up for a key at http://www.last.fm/api
        secret: obj.secret
    });
})

var d3Graph = require("./graph.js");
var AsyncTree = require("./AsyncTree.js");


//use the public directory by default
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cache("1 week"))
http.createServer(app).listen(3000);

//set up the /artist path
app.get("/artist", function(req, res) {
    var artist = req.query.artist;
    var layers = req.query.layers || 2;
    var artistsPerLayer = req.query.artistsPerLayer || 5;
    var tree = new AsyncTree(artist, getChildren, layers);
    tree.init().then(function(tree){
        var graph = new d3Graph().graphFromTree(tree.root);
        if(graph.nodes.length < 2){
            res.send({err:{message:"The artist you supplied could not be found"}})
        } else {
            res.send(graph);
        }
    }, function(err){
        res.send({err: err})
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
