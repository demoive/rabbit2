
module.exports = {

  desc: 'Performs a Google search.',

  usage: 'google|g {search_term}',

  aliases: {
    "^g$" : "",
    "^g\\s+" : "",
  },

  exec: function (runData) {
    var searchTerms = encodeURIComponent(runData.argString);

    return `https://www.google.com/search?q=${searchTerms}`;
  },

};
