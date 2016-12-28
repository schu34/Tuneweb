var numResults = 5; //number of results this needs to be user setable

//gets called each time there is a search
var explore = function() {
    GraphView.clear();
    var query = {};
    query.artist = $(".artist").val() || $(".center .artist").val();
    query.artist = utils.titleCase(query.artist);
    $(".artist").val("");
    $(".center .artist").val("");

    if (query.artist.length > 0)
        fetchRelated(query, function(graph) {
            console.log(graph);
            // graph.update(query.artist, artists);
            GraphView.newData(graph);
            // GraphView.updateView();
            transition();
        });
};
//request related artists from the server
var fetchRelated = function(query, callback) {
    $.post('/artist', query, function(data) {
        callback(data);
    });
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
    $("svg").attr("width", $("body").width());
    $("svg").attr("height", $(window).height());
    $(".artist").focus();

    $(".top-search").hide();
    $("button").on("click", explore);

    //set up enter key listener
    $("input").keypress(function(e) {
        if (e.which === 13) {
            explore();
        }
    });

    GraphView.init();
});
