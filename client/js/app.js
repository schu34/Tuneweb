var apikey = "909HQJYZBYPA4XWIV";

var nodes = [];

var graph = new Springy.Graph();

var numReasults = 5 //number of reasults 

$("#my_canvas").springy({
    graph: graph
});

var testData = {
    "response": {
        "artists": [{
            "id": "ARYJFJ91187B9B149A",
            "name": "The Wilderness"
        }, {
            "id": "ARGOAEZ122988F2731",
            "name": "Big a"
        }, {
            "id": "AREBMWM11F50C47FFC",
            "name": "Fantastic Four"
        }, {
            "id": "ARGMRZU1187B9B6981",
            "name": "The Heaters"
        }, {
            "id": "ARDLOZD1187B9B98A8",
            "name": "Boundless"
        }, {
            "id": "ARVXBOT1187B992D93",
            "name": "City to City"
        }, {
            "id": "ARUAQW51187B994266",
            "name": "Private Dancer"
        }, {
            "id": "ARSBVCE1187B99BE74",
            "name": "Hearts of Stone"
        }, {
            "id": "ARCF56Q1187FB55282",
            "name": "Airliner"
        }, {
            "id": "ARX75EF1187B9A272F",
            "name": "Loom"
        }, {
            "id": "ARBCWYF1187B9953F8",
            "name": "Lavish"
        }, {
            "id": "ARFPFW61187B992B5B",
            "name": "Insatiable"
        }, {
            "id": "ARIYZVN1269FCD068A",
            "name": "The Foreground"
        }, {
            "id": "ARGQULJ12086C11996",
            "name": "Rhode Island"
        }, {
            "id": "ARYHWYN1187B989C56",
            "name": "Eleventh Hour"
        }],
        "status": {
            "code": 0,
            "message": "Success",
            "version": "4.2"
        }
    }
};


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
        $(".center").slideUp("slow");
        $("#my_canvas").slideDown("slow");
        $("html, body").animate({
            scrollTop: $('#my_canvas').offset().top
        }, "slow")
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
    $("button").on("click", explore);




});