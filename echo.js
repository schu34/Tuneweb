var Rest  = require("node-rest-client")
var rest = new Rest();
var echo = {};

echo.apiKey = "909HQJYZBYPA4XWIV";

echo.getRelatedArtists = function(artist, numResults, callback){
  //build the base request url
  url = "http://developer.echonest.com/api/v4/artist/similar?api_key=" + this.apiKey;
  if (artist.length){
    //add artist name
    url += ("&name=" + artist);
    //add format and number of results
    url += ("&format=json&results=" + numResults);
    var related = "it didn't work";
    console.log(url);

    //make the request to echonest api
    request(url, function(error, response, body){
      if(error){
        console.log("ERROR:" + error);
      } else {
        console.log(body);
        callback(body);
        related = body;
      }
    });
  }
};

module.exports = echo;
