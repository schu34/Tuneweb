var uniq = require('lodash.uniq');
var uniqWith = require("lodash.uniqwith");
var isEqual = require("lodash.isequal")
/**
 * represents the data for a d3 forced directed graph.
 * @constructor
 * @param {string[]} - array of nodes(creates a graph with no nodes if ommited)
 * @param {Object[]} - array of links(creates a graph with no links if ommited)
 */
function Graph(nodes, links){
    this.nodes = nodes || [];
    this.links = links || [];

    /**
     * Adds a list of links to a given node. Adds nodes to the nodes list if
     * they aren't already present
     * @param {string} nodeId - id of node to link from
     * @param {string[]} newNodes - list of nodes to link to
     */
    this.addLinksToNode = function(nodeId, newNodes){
        if(!nodeId || !newNodes){
            throw "bad arguments to addLinksToNode";
        }
        var ret = [];
        for (var i = 0; i < newNodes.length; i++) {
            ret.push({source: nodeId, destination: newNodes[i]});
        }
        this.links = this.links.concat(ret);
        this.filterDuplicates();
        return this;
    }

    /**
     * adds new nodes to the graph
     * @param {string[]} nodes - nodes to add
     */
    this.addNodes = function(nodes){
        this.nodes = this.nodes.concat(nodes);
        this.filterDuplicates();
        return this;

    }

    /**
     *creates a new graph with one center node connected to all the other nodes
     * @param {string} center - center node
     * @param {string[]} connections - other nodes
     */
    this.newGraph = function(center, connections){
        this.addNodes(center);
        this.addNodes(connections);

        this.addLinksToNode(center, connections);
        this.filterDuplicates();
        return this;
    }

    /**
     * removes duplicates in the nodes and links lists.
     */
    this.filterDuplicates = function(){
        this.nodes = uniq(this.nodes);
        this.links = uniqWith(this.links, isEqual);
        return this;
    }

}

module.exports = Graph;
