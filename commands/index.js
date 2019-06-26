const fs = require('fs');
const path = require('path');

var cmdDirectory = {
  /*
  // Command structure template.
  // The name of your file or directory is the unique identifier for your command (please use lowercase, alphanumeric only).
  {
    desc: '',          // A helpful description of what your command does.
    
    usage: '',         // Usage specifications.

    aliases: {         // Alternative ways to invoke your commend. When matched against the regex in the key, your command is re-invoked with replaced pattern in the value as the argument list.
      "regexp_string"  // key: a regex patterns to match against the entire intent (cmd+args).
      :
      "replace_string" // val: used as the replacement pattern the matched .
    },

    exec: function (args) {  // Your business logic of your command. This function will receive an array of white-space-tokenised arguments.
      // In the typical scenario, your subroutine completes with a redirection to a URL. In this case, simply return a URL string and rabbit2 will execute the redirection.
      // For more advanced cases (e.g. serving text/json, etc.), the Express response object is made available through rabbit2.serverResponse giving you full control over to how handle requests.
      // Note: _YOU NEED TO_ serve a response to the server if your function doesn't return a URL string.
    },
  },
  */
};

/**
 * Builds the full directory of commands from files or folders within this directory.
 * The name of the directory or file is used as the unique identifier for the command.
 */
fs.readdirSync(__dirname).forEach(function (file) {
  if (file === 'index.js') {
    return;
  }

  let name = path.parse(file).name;
  let cmdObj = require(__dirname + '/' + name);

  cmdDirectory[name] = Object.freeze(cmdObj);
});

module.exports = Object.freeze(cmdDirectory);
