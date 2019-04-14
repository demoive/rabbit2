
const bunny1 = require('./bunny1');

const JIRA_BASE_URL = 'https://company.atlassian.net';
const JIRA_PRINCIPLE_PROJECT_KEY = 'PROJ';

var cmdDirectory = {

  /*
  // SAMPLE ENTRY
  "command_name": {  // Unique identifier for your command. Lowercase, alphanumeric, please.
    desc: '',        // A helpful description of what your command does -- shown in the <code>list</code> command to describe the command (contents are not escaped so be careful!).
    aliases: {       // Alternative ways to invoke your commend. When matched against the regex in the key, your command is re-invoked with replaced pattern in the value as the argument list.
      "regexp_string"  // key: a regex patterns to match against the entire intent (cmd+args).
      :
      "replace_string" // val: used as the replacement pattern the matched .
    },
    exec: function (args) {  // Your business logic of your command. This function will receive an array of white-space-tokenised arguments.
      // In the typical scenario, your subroutine completes with a redirection to a URL. In this case, simply return a URL string and bunny1 will execute the redirection.
      // For more advanced cases (e.g. serving text/json, etc.), the Express response object is made available through bunny1.serverResponse giving you full control over to how handle requests.
      // Note: _YOU NEED TO_ serve a response to the server if your function doesn't return a URL string.
    },
  },
  */

  "readme": {
    desc: 'Shows the README for this tool.',
    aliases: {
      "^help$" : "",
    },
    exec: function (args) {
      bunny1.serverResponse.sendFile(__dirname + '/README.md');
    },
  },

  "list": {
    desc: 'Lists all available commands. Optionally search the list.',
    aliases: {
      "^ls(?:\\s+(.+))?$" : "$1",
    },
    exec: function (args) {
      var cmds = [];
      var filterTerms = args.join('|');

      Object.keys(cmdDirectory).forEach(function (cmdName) {
        if (cmdName.match(filterTerms)) {
          cmds.push({
            name: cmdName,
            desc: cmdDirectory[cmdName].desc,
            //aliases: cmdDirectory[cmdName].aliases,
          });
        }
      });

      bunny1.serverResponse.render('list', { cmds });
    },
  },

  "echo": {
    desc: 'returns back what you give to it',
    aliases: {
    },
    exec: function (args) {
      bunny1.serverResponse.send(args.join(' '));
    },
  },

  "g": {
    desc: 'Performs a Google search. We could fallback to <code>yubnub</code>, but why do an unnecessary roundtrip for something as common as a Google search?',
    aliases: {
      "^google (.+)$" : "$1",
    },
    exec: function (args) {
      var searchTerms = encodeURIComponent(args.join(' '));

      return `https://www.google.com/search?q=${searchTerms}`;
    },
  },

  "mdnjs": {
    desc: 'Searches the MDN Developer Docs. If only one search term exists, assume it is the name of a Global JS Object and go directly to it\'s reference page.',
    aliases: {
    },
    exec: function (args) {
      var searchTerms = encodeURIComponent(args.join(' '));

      if (args.length > 1) {
        return `https://developer.mozilla.org/en-US/search?q=${searchTerms}`;
      } else {
        return `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/${searchTerms}`;
      }
    },
  },

  "jira": {
    desc: `Go to a specific Jira issue. Accepts the following formats: <code>jira {fullkey} | j {keynumber} | {keynumber}</code>, using <b><code>${JIRA_PRINCIPLE_PROJECT_KEY}</code></b> as the project key if not specified.`,
    aliases: {
      "^([A-Z]+-\\d+)$" : "$1",
      "^j ?(\\d+)$"     : `${JIRA_PRINCIPLE_PROJECT_KEY}-$1`,
      "^(\\d{3,5})$"    : `${JIRA_PRINCIPLE_PROJECT_KEY}-$1`,
    },
    exec: function (args) {
      var issueId = encodeURIComponent(args.join(' '));

      return `${JIRA_BASE_URL}/browse/${issueId}`;
    },
  },

  "jql": {
    desc: 'Performs a <a href="https://confluence.atlassian.com/jirasoftwarecloud/advanced-searching-764478330.html">JQL search</a> in Jira.',
    aliases: {
    },
    exec: function (args) {
      var jqlString = encodeURIComponent(args.join(' '));

      return `${JIRA_BASE_URL}/issues/?jql=${jqlString}`;
    },
  },

};

// Force all keys of the cmdDirectory object to lowercase.
cmdDirectory = Object.keys(cmdDirectory).reduce((acc, cur) => (
  acc[cur.toLowerCase()] = cmdDirectory[cur], acc), {}
);

module.exports = cmdDirectory;

// consider changing this command directory to individual files, one per command
// this guarantees valid names for commands and allows a cleaner way for individual commands to define any constants or resources needed to perform their work.
// module.exports.readme = {
//   desc: 'Shows the README for this tool.',
//   aliases: {
//     "^help$" : "",
//   },
//   exec: args => {
//     bunny1.serverResponse.sendFile(__dirname + '/README.md');
//   },
// };
