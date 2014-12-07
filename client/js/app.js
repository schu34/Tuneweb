var nodes = [];//array of all the nodes on the graph

var graph = new Springy.Graph();//graph init

var numReasults = 5; //number of reasults

//attach the graph to the canvas element in the html page

$("#my_canvas").springy({
    graph: graph
});



//gets called each time there is a search
var explore = function() {
    clearGraph();
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

//request related artists from the server
var fetchRelated = function(query){
	$.post('/artist', query , function(data) {
    updateGraph(query.artist, JSON.parse(data));
    transition();
	});
};


//updates the graph
var updateGraph = function(artist, data) {
    console.log("data: " + data);
    var nodeLabels = nodes.map(function(node) {
        console.log(node);
        return node.data.label;
    });

    nodeIndex = nodeLabels.indexOf(artist);
    if (nodeIndex === -1) {
        centerNode = graph.newNode({
            label: artist
        });
        nodes.push(centerNode);
    } else {
        centerNode = nodes[nodeIndex];
    }

    var artistObjects = data.response.artists;
    var artists = artistObjects.map(function(obj) {
        return obj.name;
    });

    var newRelatedArtistFound = false;
    for (var i = 0; i < artists.length; i++) {
        if(nodeLabels.indexOf(artists[i]) === -1){
            var newNode = graph.newNode({
                label: artists[i]
            });
            graph.newEdge(newNode, centerNode);
            nodes.push(newNode);
            newRelatedArtistFound = true;
        }else{

        }
    }
    if(!newRelatedArtistFound){
        alert("all artists related to " + artist +  " are already being displayed");
    }
};


//clears the graph on the screen and resets the nodes array to []
var clearGraph = function(){
    graph.filterEdges(function(){return false;});
    graph.filterNodes(function(){return false;});
    nodes = [];
};


//transition from showing the search box to showing the canvas with the graph
var transition = function(){
    $(".center").fadeOut('slow');

    $("#my_canvas").fadeIn('slow');

    $('html, body').animate({
        scrollTop: $("#my_canvas").offset().top
    }, 500);

    $(".top_search").fadeIn('slow');
};



//get everything ready when the page loads
$(document).ready(function() {
    //hide all the stuff that's not shown on page load
    $("#my_canvas").hide();
    $(".top_search").hide();
    $("button").on("click", explore);

    //set up enter key listener
    $("input").keypress(function(e){
        if(e.which === 13){
            explore();
        }
    });
});
