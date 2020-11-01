
module.exports = {

  desc: 'Searches your Google Drive. With no parameters, takes you to your Google Drive home.',

  usage: 'drv [{search_terms}]',

  aliases: {
  },

  exec: function (args) {
    if (args.length === 0) {
      return 'https://drive.google.com/drive/my-drive';
    }

    var searchTerms = encodeURIComponent(args.join(' '));

    return `https://drive.google.com/drive/search?q=${searchTerms}`;
  },

};
