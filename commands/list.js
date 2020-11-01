
module.exports = {

  desc: 'Lists all available commands. Optionally search the list.',

  usage: 'list|ls [{search_terms}]',

  aliases: {
    "^ls$" : "",
    "^ls\\s+" : "",
  },

  exec: function (args) {
    const rabbit2 = require('../rabbit2');

    var cmds = [];
    var filterTerms = args.join('|');

    const cmdDirectory = require('./');

    Object.keys(cmdDirectory).forEach(function (cmdName) {
      if (cmdName.match(filterTerms)) {
        cmds.push({
          name: cmdName,
          usageCount: rabbit2.cmdUsageCount[cmdName] || 0,
          desc: cmdDirectory[cmdName].desc,
          usage: cmdDirectory[cmdName].usage,
          //aliases: cmdDirectory[cmdName].aliases,
        });
      }
    });

    cmds.sort(function (a, b) {
      return b.usageCount - a.usageCount;
    });

    rabbit2.serverResponse.render('list', { cmds });
  },

};
