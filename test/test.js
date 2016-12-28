var assert = require("assert")
var expect = require("expect.js")
var utils = require("../public/js/utils.js")
var Graph = require("../lib/graph.js")


describe("utils", function() {
    describe("#TitleCase()", function() {
        it("capitalizes one  word", function() {
            assert.equal(utils.titleCase("matt"), "Matt");
        })
        it("capitalizes multiple words", function() {
            assert.equal(utils.titleCase("matthew schupack"), "Matthew Schupack")
        })
        it("lowercases everything else", function() {
            assert.equal(utils.titleCase("hELlO WoRlD"), "Hello World")
        })
    });
})



describe("Server Side Graph Representation", function() {

    var startNodes = [{id: "Metallica"}, {id:  "Led Zeppelin"}, {id:  "Yes"}];
    var startLinks = [{
        source: "Metallica",
        target: "Yes"
    }];

    describe("constructor", function() {
        it("creates a new graph", function() {
            assert.notEqual(new Graph(), undefined);
            assert.notEqual(new Graph(), null);
        });
        it("creates a graph with no nodes(given no args)", function() {
            assert.deepEqual(new Graph().nodes, []);
        });
        it("creates a graph witn no links(given no args)", function() {
            assert.deepEqual(new Graph().links, []);
        });



        it("creates a graph with nodes(given args)", function() {
            var graph = new Graph(startNodes, startLinks);
            assert.deepEqual(graph.nodes, [{id: "Metallica"},{id:  "Led Zeppelin"},{id:  "Yes"}]);
        });
        it("creates a graph with links(given args)", function() {
            assert.deepEqual(new Graph(startNodes, startLinks).links, [{
                source: "Metallica",
                target: "Yes"
            }])
        });
    });

    describe("other graph operations", function() {
        it("#filterDuplicates", function(){
            var nodesWithDups = [{id: "Metallica"}, {id: "Metallica"}, {id: "Metallica"}];
            var linksWithDups = [{
                source: "Metallica",
                target: "Iron Maiden"
            }, {
                source: "Metallica",
                target: "Iron Maiden"
            }];
            var graph = new Graph(nodesWithDups, linksWithDups);
            graph.filterDuplicates();
            assert.deepEqual(graph.nodes, [{id: "Metallica"}]);
            assert.deepEqual(graph.links, [{source:"Metallica", target: "Iron Maiden"}])
        });


        it("#newGraph", function() {
            var graph = new Graph();
            var expectedLinkValue = [{
                source: "Metallica",
                target: "Iron Maiden"
            }, {
                source: "Metallica",
                target: "Anthrax"
            }, {
                source: "Metallica",
                target: "Slayer"
            }, {
                source: "Metallica",
                target: "Megadeth"
            }];

            graph.newGraph("Metallica", ["Iron Maiden", "Anthrax", "Slayer", "Megadeth"]);
            assert.deepEqual(graph.nodes, [{id: "Metallica"}, {id: "Iron Maiden"}, {id: "Anthrax"}, {id: "Slayer"}, {id: "Megadeth"}]);
            assert.deepEqual(graph.links, expectedLinkValue);
        });
        describe("#addNodes", function() {
            it("works with an array", function(){
                var graph = new Graph(startNodes, startLinks);
                assert.deepEqual(graph.addNodes(["Hella", "The Mars Volta"]).nodes, [{id: "Metallica"}, {id:  "Led Zeppelin"}, {id:  "Yes"}, {id:  "Hella"}, {id:  "The Mars Volta"}]);	
            });
            it("works with a string", function(){
                var graph = new Graph(startNodes, startLinks);
                assert.deepEqual(graph.addNodes("Hella").nodes, [{id: "Metallica"}, {id:  "Led Zeppelin"}, {id:  "Yes"}, {id:  "Hella"}]);
            });
    	});
        it("#addLinksToNode", function() {
            var graph = new Graph(startNodes);
            graph.addLinksToNode("Metallica", ["Iron Maiden", "Anthrax", "Slayer", "Megadeth"]);
	    assert.deepEqual(graph.links, [{
                source: "Metallica",
                target: "Iron Maiden"
            }, {
                source: "Metallica",
                target: "Anthrax"
            }, {
                source: "Metallica",
                target: "Slayer"
            }, {
                source: "Metallica",
                target: "Megadeth"
            }]);
        })
    })
})
