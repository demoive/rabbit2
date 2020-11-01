
module.exports = {

  desc: 'Lists all available commands. Optionally search the list.',

  usage: 'list|ls [{search_terms}]',

  aliases: {
    "^ls$" : "",
    "^ls\\s+" : "",
  },

  exec: function (args) {
    const rabbit2 = require('../rabbit2');
    //const cmdDirectory = require('./');

    var cmds = [];
    var filterTerms = args.join('|');


    Object.keys(rabbit2.cmdDirectory).forEach(function (cmdName) {
      if (cmdName.match(filterTerms)) {
        cmds.push({
          name: cmdName,
          usageCount: rabbit2.cmdUsageCount[cmdName] || 0,
          desc: rabbit2.cmdDirectory[cmdName].desc,
          usage: rabbit2.cmdDirectory[cmdName].usage,
          //aliases: rabbit2.cmdDirectory[cmdName].aliases,
        });
      }
    });

    cmds.sort(function (a, b) {
      return b.usageCount - a.usageCount;
    });

    rabbit2.serverResponse.render('list', { cmds });
  },

};
