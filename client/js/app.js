var apikey = "909HQJYZBYPA4XWIV";

var nodes = [];

var graph = new Springy.Graph();

var numReasults = 5; //number of reasults 

$("#my_canvas").springy({
    graph: graph
});




var explore = function() {
    artist = $(".artist").val();
    if (artist.length > 0)
        fetchRelated(artist);
    else {
        artist = $(".center .artist").val();
        if (artist.length > 0)
            fetchRelated(artist);
    }
};


var fetchRelated = function(artist) {
    console.log("fetching related artists" + artist);

    //save paramaters for the query to echonest

    url = "http://developer.echonest.com/api/v4/artist/similar";
    args = {
        format: "json",
        results: numReasults,
        name: artist,
        api_key: apikey
    };

    //perform the query

    $.getJSON(url, args, function(json, textStatus) {
        $(".center").fadeOut("slow");
        $(".top_search").fadeIn("slow");
        $("#my_canvas").fadeIn("slow");
        $("html, body").animate({
            scrollTop: $('#my_canvas').offset().top
        }, "slow");
        updateGraph(artist, json);
    });
};

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


$(document).ready(function($) {
    $("#my_canvas").hide();
    $(".top_search").hide();
    $("button").on("click", explore);




});