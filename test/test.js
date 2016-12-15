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

    var nodes = ["Metallica", "Led Zeppelin", "Yes"];
    var links = [{
        source: "Metallica",
        destination: "Yes"
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
            var graph = new Graph(nodes, links);
            for (var i = 0; i < nodes.length; i++) {
                assert.equal(nodes[i], graph.nodes[i]);
            }
        });
        it("creates a graph with links(given args)", function() {
            assert.deepEqual(new Graph(nodes, links).links, [{
                source: "Metallica",
                destination: "Yes"
            }])
        });
    });

    describe("other graph operations", function() {
        it("filters duplicates", function(){
            var nodesWithDups = ["Metallica", "Metallica", "Metallica"];
            var linksWithDups = [{
                source: "Metallica",
                destination: "Iron Maiden"
            }, {
                source: "Metallica",
                destination: "Iron Maiden"
            }];
            var graph = new Graph(nodesWithDups, linksWithDups);
            graph.filterDuplicates();
            assert.deepEqual(graph.nodes, ["Metallica"]);
            expect(graph.links).to.eql([{source: "Metallica", destination: "Iron Maiden"}]);
        });


        it("creates a new graph", function() {
            var graph = new Graph();
            var expectedLinkValue = [{
                source: "Metallica",
                destination: "Iron Maiden"
            }, {
                source: "Metallica",
                destination: "Anthrax"
            }, {
                source: "Metallica",
                destination: "Slayer"
            }, {
                source: "Metallica",
                destination: "Megadeth"
            }];

            graph.newGraph("Metallica", ["Iron Maiden", "Anthrax", "Slayer", "Megadeth"]);
            assert.deepEqual(graph.nodes, ["Metallica", "Iron Maiden", "Anthrax", "Slayer", "Megadeth"]);
            assert.deepEqual(graph.links, expectedLinkValue);
        });
        it("adds nodes", function() {
            var graph = new Graph(nodes, links);
            assert.deepEqual(graph.addNodes(["Hella", "The Mars Volta"]).nodes, ["Metallica", "Led Zeppelin", "Yes", "Hella", "The Mars Volta"]);
        });
        it("adds a new set of connections", function() {
            var graph = new Graph(nodes, links);
        })

    })

})
