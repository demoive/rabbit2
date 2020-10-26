
module.exports = {

  desc: 'Create or search existing glossary definitions. Similar to an internal Urban Dictionary.',

  usage: 'wut|com [{term_phrase}]',

  aliases: {
    "^com(?:\\s+(\\S+))?$" : "$1",
  },

  exec: function (args) {
    // var cmds = [];
    // var filterTerms = args.join('|');

    var terms = [
      {
        phrase: 'DWH',
        definition: '"Data Warehouse" refering to a combination of multiple data sources across the company. Source of truth of __. AKA "Data Pool".',
        authored: {
          ts: '2020-01-10T22:03:11.549Z', // now.toISOString()
          email: 'paulo.avila@',
        },
        votes_up: [
          {
            ts: '',
            email: 'paulo.avila@',
          }
        ]
      },
      {
        phrase: 'Glover',
        definition: 'Also known as: "Courier" (people delivering things on Glovo).',
        authored: {
          ts: '2020-01-10T22:03:11.549Z', // now.toISOString()
          email: 'paulo.avila@',
        },
        votes_up: [
          {
            ts: '',
            email: 'paulo.avila@',
          },
          {
            ts: '',
            email: 'paulo.avila@',
          }
        ]
      }
    ];

    /** /
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
    /**/

    const rabbit2 = require('../rabbit2');
    rabbit2.serverResponse.render('wut', { terms });
  },

};
