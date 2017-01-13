var assert = require("assert");
var AsyncTree = require("../lib/AsyncTree");
var LastfmPromise = require("../lib/LastfmPromise.js");
var jsonFile = require("jsonfile");

var file = "keys.json";


describe("AsyncTree", function(){
    var lastfm;

    jsonFile.readFile(file, function(err, obj) {
        if (err) {
            throw err;
        }
        lastfm = new LastfmPromise({
            api_key: obj.api_key, // sign-up for a key at http://www.last.fm/api
            secret: obj.secret
        });
    });

    it("creates a tree", function(){
        var tree = new AsyncTree(1, getChildren, 3);
        assert.notEqual(tree, undefined);
        assert.notEqual(tree, null);
        function getChildren() {

        }
    });

    it("populates the tree", function(){

        return new AsyncTree(1, getChildren, 3).init().then(function(tree){
            var numTree = require("./AsyncTree/numTree.json");
            assert.deepEqual(tree.root, numTree);
        });
        /******************************End Test********************************/


        function getChildren(num){
            return new Promise(function(resolve) {
                setTimeout(function(){
                    resolve([num*2, num*2+1]);
                }, 100);
            });
        }

    });

    it("works while getting data from the network", function(){
        this.timeout(10000);
        return new AsyncTree("Yes", lastfmGetChildren, 1).init().then(function(tree){
            var artistTree = require("./AsyncTree/artistTree.json");
            assert.deepEqual(tree.root, artistTree);
        });
        /******************************End Test********************************/

        function lastfmGetChildren(artist){
            return lastfm.requestPromise("artist.getSimilar",{
                artist: artist,
                limit: 5, //hardcoded for testing purposes
            }).then(function(val){
                return val.similarartists.artist.map(function(a) {
                    return a.name
                });
            })
        }
    });

    it.skip("works with big requests and variable time", function(){
        this.timeout(10000);
        return new AsyncTree(1, randGetChildren, 6).init().then(function(tree){
            var bigNumTree = require('./AsyncTree/bigNumTree.json');
            assert.deepEqual(tree.root, bigNumTree);
        })
        /******************************End Test********************************/



        function randGetChildren(num){
            return new Promise(function(resolve) {
                setTimeout(function(){
                    resolve([num*2, num*2+1]);
                }, Math.random() * 1000 + 500);
            });
        }
    });

    it("removes duplicates", function(){
        this.timeout(5000);
        var noDupTree = require("./AsyncTree/noDupTree.json");
        return new AsyncTree(1, duplicateGetChildren, 3).init().then(function(tree){
            assert.deepEqual(tree.root, noDupTree);
        });
        /******************************End Test********************************/


        function duplicateGetChildren(num){
            return new Promise(function(resolve) {
                setTimeout(function(){
                    resolve([(num*2)%10, (num*2+1)%10]);
                },500);
            });
        }
    });

    it("flattens a tree", function() {
        return new AsyncTree(1, getChildren, 3).init().then(function(tree) {
            var flatTree = require("./AsyncTree/flattenedTree.json");
            assert.deepEqual(AsyncTree.flatten(tree.root), flatTree);
        });
        /******************************End Test********************************/


        function getChildren(num){
            return new Promise(function(resolve) {
                setTimeout(function(){
                    resolve([num*2, num*2+1]);
                }, 100);
            });
        }
    });

    it("work removes duplicates with string vals", function(){
        this.timeout(10000);
        var bigArtistTree = require("./AsyncTree/bigArtistArray.json");
        return new AsyncTree("Radiohead",lastfmGetChildren, 3 ).init().then(function(tree){
            assert.deepEqual(AsyncTree.flatten(tree.root).sort(nodeSort), bigArtistTree.sort(nodeSort));
        });

        /******************************End Test********************************/

        function nodeSort(a, b){
            if(a.val < b.val){
                return -1;
            } else if(a.val > b.val){
                return 1;
            } else {
                return 0;
            }
        }
        function lastfmGetChildren(artist){
            return lastfm.requestPromise("artist.getSimilar",{
                artist: artist,
                limit: 5, //hardcoded for testing purposes
            }).then(function(val){
                return val.similarartists.artist.map(function(a) {
                    return a.name
                });
            });
        }
    });
});
