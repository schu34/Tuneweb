var request = require("request");
var echo = {};

echo.apiKey = "909HQJYZBYPA4XWIV";

echo.getRelatedArtists = function(artist, results, callback){
  //build the base request url
  url = "http://developer.echonest.com/api/v4/artist/similar?api_key=" + this.apiKey;
  if (artist.length){
    //add artist name
    url += ("&name=" + artist);
    //add format and number of results
    url += ("&format=json&results=" + results);
    var related = "it didn't work";
    //make the request to echonest api
    request(url, function(error, response, body){
      if(error){
        console.log("ERROR" + error);
      } else {
          callback(body);
          related = body;
      }
    });
  }
};

module.exports = echo;
