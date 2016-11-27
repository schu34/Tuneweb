utils = {
  titleCase: function(str) {
      words = str.split(" ");

      return words.map(function(i){
        return i[0].toUpperCase() + i.substring(1).toLowerCase()
      }).join(" ");
  }
}


module.exports = utils;
