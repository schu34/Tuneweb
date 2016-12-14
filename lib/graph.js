/**
 *represents the data for a d3 forced directed graph.
 */
function Graph(nodes, links){
    this.nodes = nodes || [];
    this.links = links || [];

    /**
     * Adds a list of links to a given node
     * @param {string} nodeId - id of node to link from
     * @param {string[]} newNodes - list of nodes to link to
     */
    this.addLinksToNode = function(nodeId, newNodes){
        var ret = [];
        for (var i = 0; i < newNodes.length; i++) {
            ret.push({source: nodeId, destination: newNodes[i]});
        }
    }

    /**
     * adds new nodes to the graph
     */
    this.addArtists = function(nodes){
        this.nodes.concat(nodes);
    }
}

module.exports =
