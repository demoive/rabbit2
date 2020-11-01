
module.exports = {

  desc: 'Search Giphy.com for gifs 👾!',

  usage: 'giphy {search_terms}',

  aliases: {
  },

  run: function (runData) {
    var searchTerms = encodeURIComponent(runData.args.join('-'));
    // https://developers.giphy.com/docs/#translate-endpoint

    return `https://giphy.com/search/${searchTerms}`;
  },

};
