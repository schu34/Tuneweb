var numResults = 5; //number of results this needs to be user setable

var width, height;


var force;

var graph = {
    nodes: {},
    links: {}
};


//gets called each time there is a search
var explore = function() {
    clearGraph();
    var query = {};
    query.artist = $(".artist").val() || $(".center .artist").val();
    query.artist = titleCase(query.artist);
    $(".artist").val() = "";
    $(".center .artist").val = "";

    if (query.artist.length > 0)
        fetchRelated(query, function(artists) {
            updateGraph(query.artist, data);
            transition();
        });
};
//request related artists from the server
var fetchRelated = function(query, callback) {
    $.post('/artist', query, function(data) {
        callback(data);
    });
};


//updates the graph
var updateGraph = function(artist, data) {
    console.log("data: " + data);
    newNodes = data.map(function(a) {
        return {
            id: a.name
        };
    })

    for (var i = 0; i < newNodes.length; i++) {
        graph.links.append({
            source: artist,
            target: newNodes.id(),
            value: 10
        });
    }

};


//clears the graph on the screen and resets the nodes array to []
var clearGraph = function() {
    graph.filterEdges(function() {
        return false;
    });
    graph.filterNodes(function() {
        return false;
    });
    nodes = [];
};


//transition from showing the search box to showing the canvas with the graph
var transition = function() {
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
    $("svg").hide();
    $(".top_search").hide();
    $("button").on("click", explore);

    //set up enter key listener
    $("input").keypress(function(e) {
        if (e.which === 13) {
            explore();
        }
    });
    width = $(window).width;
    height = $(window).height;

    svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    force = d3.layout.force()
        .charge(-120)
        .linkDistance(100)
        .size([width, height]);

});
