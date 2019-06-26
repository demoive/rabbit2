
module.exports = {

  desc: 'Search Giphy.com for gifs!',

  usage: 'giphy {search_terms}',

  aliases: {
  },

  exec: function (args) {
    var searchTerms = encodeURIComponent(args.join('-'));
    // https://developers.giphy.com/docs/#translate-endpoint

    return `https://giphy.com/search/${searchTerms}`;
  },

};
