
module.exports = {

  desc: 'Performs a Google search.',

  usage: 'google|g {search_term}',

  aliases: {
    "^g$" : "",
    "^g\\s+" : "",
  },

  exec: function (args) {
    var searchTerms = encodeURIComponent(args.join(' '));

    return `https://www.google.com/search?q=${searchTerms}`;
  },

};
