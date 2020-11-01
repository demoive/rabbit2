
module.exports = {

  desc: 'Lists all available commands. Optionally search the list.',

  usage: 'list|ls [{search_terms}]',

  aliases: {
    "^ls$" : "",
    "^ls\\s+" : "",
  },

  run: function (runData) {
    var cmds = [];
    var filterTerms = runData.args.join('|');

    const cmdDirectory = require('./');

    Object.keys(cmdDirectory).forEach(function (cmdName) {
      if (cmdName.match(filterTerms)) {
        cmds.push({
          name: cmdName,
          desc: cmdDirectory[cmdName].desc,
          usage: cmdDirectory[cmdName].usage,
          //aliases: cmdDirectory[cmdName].aliases,
        });
      }
    });

    runData.serverResponse.render('list', { cmds });
  },

};
