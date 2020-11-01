
module.exports = {

  desc: 'Searches your Google Drive. With no parameters, takes you to your Google Drive home.',

  usage: 'drv [{search_terms}]',

  aliases: {
  },

  run: function (runData) {
    if (runData.args.length === 0) {
      return 'https://drive.google.com/drive/my-drive';
    }

    var searchTerms = encodeURIComponent(runData.args.join(' '));

    return `https://drive.google.com/drive/search?q=${searchTerms}`;
  },

};
