
module.exports = {

  desc: 'Lists all available commands. Optionally search the list.',

  usage: 'list|ls [{search_terms}]',

  aliases: {
    "^ls(?:\\s+(\\S+))?$" : "$1",
  },

  exec: function (args) {
    var cmds = [];
    var filterTerms = args.join('|');

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

    const rabbit2 = require('../rabbit2');
    rabbit2.serverResponse.render('list', { cmds });
  },

};
