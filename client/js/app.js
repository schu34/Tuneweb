var nodes = [];//array of all the nodes on the graph

var graph = new Springy.Graph();//graph init

var numReasults = 5; //number of reasults

//attach the graph to the canvas element in the html page

$("#my_canvas").springy({
    graph: graph
});



//gets called each time there is a search
var explore = function() {
    var query = {};
    query.artist =$(".artist").val();
    if (query.artist.length > 0)
        fetchRelated(query);
    else {
        query.artist = $(".center .artist").val();
        if (query.artist.length > 0)
            fetchRelated(query);
    }
};

//send a request to the server
var fetchRelated = function(query){
	$.post('/artist', query , function(data) {
		console.log("artist query sent");
    console.log(JSON.parse(data));
	});
};


//updates the graph
var updateGraph = function(artist, data) {

    var nodeLabels = nodes.map(function(node) {
        return node.label;
    });

    if (nodeLabels.indexOf(artist) === -1) {
        centerNode = graph.newNode({
            label: artist
        });
        nodes.push(newNode);
    }

    var artistObjects = data.response.artists;
    var artists = artistObjects.map(function(obj) {
        return obj.name;
    });

    for (var i = 0; i < artists.length; i++) {
        var newNode = graph.newNode({
            label: artists[i]
        });
        graph.newEdge(newNode, centerNode);
        nodes.push(newNode);
    }
};

//get everything ready when the page loads
$(document).ready(function() {
    $("#my_canvas").hide();
    $(".top_search").hide();
    $("button").on("click", explore);
});
