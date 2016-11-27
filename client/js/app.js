var numResults = 5; //number of results this needs to be user setable

var width, height;


var simulation;

var graph = {
    nodes: [],
    links: []
};



//gets called each time there is a search
var explore = function() {
    clearGraph();
    var query = {};
    query.artist = $(".artist").val() || $(".center .artist").val();
    query.artist = utils.titleCase(query.artist);
    $(".artist").val("");
    $(".center .artist").val("");

    if (query.artist.length > 0)
        fetchRelated(query, function(artists) {
            updateGraph(query.artist, artists);
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
  graph.nodes.push({id: artist});
    console.log("data: " + data);
    newNodes = data.map(function(a) {
        return {
            id: a.name,
            group: 1
        };
    })

    for (var i = 0; i < newNodes.length; i++) {
        artistIdx = graph.nodes.indexOf(newNodes[i]);
        if (artistIdx !== -1) {
            graph.links.push({
                source: artist,
                target: graph.nodes[artistIdx].id,
                value: 50
            })
            newNodes.splice(i, 1);
        }
    }

    for (var i = 0; i < newNodes.length; i++) {
        graph.links.push({
            source: artist,
            target: newNodes[i].id,
            value: 500
        });
    }
    graph.nodes = graph.nodes.concat(newNodes);

    var link = d3.select("#links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-Width", function(d) {
            return Math.sqrt(d.value);
        });

    var node = d3.select("#nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 10)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded));

    node.append("title").text(function(d) {
        return d.id;
    });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation
        .force("link")
        .links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d){return d.source.x;})
      .attr("y1", function(d){return d.source.y;})
      .attr("x2", function(d){return d.target.x;})
      .attr("y2", function(d){return d.target.y;});

    node
      .attr("cx", function(d){return d.x})
      .attr("cy", function(d){return d.y});
  }
};

function dragStarted(d){
  if(!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.dy = d.y;
}

function dragged(d){
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragEnded(d){
  if(!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

//clears the graph on the screen and resets the nodes array to []
var clearGraph = function() {

};


//transition from showing the search box to showing the canvas with the graph
var transition = function() {
    $(".center").fadeOut('slow');

    $("svg").fadeIn('slow');

    $('html, body').animate({
        scrollTop: $("#svg-container").offset().top
    }, 500);

    $(".top-search").fadeIn('slow');
};



//get everything ready when the page loads
$(document).ready(function() {
    //hide all the stuff that's not shown on page load
    $("svg").hide();
    $(".top-search").hide();
    $("button").on("click", explore);

    //set up enter key listener
    $("input").keypress(function(e) {
        if (e.which === 13) {
            explore();
        }
    });



    svg = d3.select("svg")
    width = +svg.attr("width");
    height = +svg.attr("height");

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {
            return d.id
        }))
        .force("charge", d3.forceManyBody())
        // .force("center", d3.forceCenter(width / 2, height / 2))

});
