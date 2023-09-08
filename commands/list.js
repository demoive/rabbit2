
module.exports = {

  name: 'List',
  summary: 'Show/search all commands',
  description: 'Lists all available commands. Optionally search the list.',
  usage: 'list|ls [{search}]',
  authors: ['paulo.avila@'],

  aliases: {
    "ls$" : "",
    "ls\\s+" : "",
  },

  run: function (inputArg) {
    var cmds = [];

    const matchString = this.escapeRegexString(inputArg)
      .split(/\s+/)
      .join('|')
    ;

    const matchRegexp = new RegExp(matchString, "gi");

    Object.values(this.cmdDirectory).forEach(cmdObj => {
      if (matchRegexp.test(`${cmdObj.id} ${cmdObj.name} ${cmdObj.summary} ${cmdObj.description}`)) {
        cmds.push({
          id: cmdObj.id,
          name: cmdObj.name,
          summary: cmdObj.summary,
          description: cmdObj.description,
          usage: cmdObj.usage,
          authors: cmdObj.authors,
          operators: cmdObj.operators,
          //aliases: cmdObj.aliases,
          hasRun: !!cmdObj.run, // Forces a boolean to avoid exposing the function itself.
          hasSuggest: !!cmdObj.suggest, // Forces a boolean to avoid exposing the function itself.
        });
      }
    });

    this.renderView({ cmds });
  },

};
