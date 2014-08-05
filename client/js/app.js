var apikey = "909HQJYZBYPA4XWIV"


var explore = function() {
    artist = $("#artist").val();
    if (artist.length > 0)
        fetchRelated(artist);
}


var fetchRelated = function(artist) {
    console.log("fetching related artists" + artist);

    url = "http://developer.echonest.com/api/v4/artist/similar"
    args = {
        format: "json",
        results: 20,
        name: artist,
        api_key: apikey
    }

    $.getJSON(url, args, function(json, textStatus) {
        console.log(json);
    });
}

$(document).ready(function($) {
    $("#explore").on("click", explore);
});