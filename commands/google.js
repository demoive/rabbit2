
module.exports = {

  desc: 'Performs a Google search.',

  usage: 'google|g {search_term}',

  aliases: {
    "^g(?:\\s+(\\S+))?$" : "$1",
  },

  exec: function (args) {
    var searchTerms = encodeURIComponent(args.join(' '));

    return `https://www.google.com/search?q=${searchTerms}`;
  },

};
