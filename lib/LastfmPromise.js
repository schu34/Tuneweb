/*******************************************************************************
LastfmPromise - converts lastfm node to use promises
*******************************************************************************/

var LastFmNode = require('lastfm').LastFmNode;

module.exports =
function LastfmPromise(args){
    // console.log(args);
    this.api_key = args.api_key;
    this.secret = args.secret;

    this.lastfm = new LastFmNode({
        api_key: this.api_key, // sign-up for a key at http://www.last.fm/api
        secret: this.secret
    });
    var that = this;


    this.requestCallback = function(query, settings, success, error){
        debugger;
        settings.handlers = {
            success: success,
            error: error
        }
        // console.log(this.lastfm);
        that.lastfm.request(query, settings);
    }

    /**
    * gets related artists using lastfm.
    * @param {string} artist - artist to get related artists for
    * @return a promise that resolves to a lasfm response
    ****************************************************/
    this.requestPromise = function(query, settings){
        debugger;

        return new Promise(function(res, rej){
            try {
                // console.log(query + settings);
                that.requestCallback(query, settings, res, rej);
            }catch (e) {
                console.log("error: " + e)
                rej(e);
            }
        });
    }
    // console.log(this);
}
