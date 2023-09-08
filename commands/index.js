const fs = require('fs');
const path = require('path');

var cmdDirectory = {
  /*
  // Command structure template.
  // The name of your file or directory is the unique identifier for your command (please use lowercase, alphanumeric only).

  {
    name: '',          // Command name, useful if the command alias is an acronym or otherwise cryptic.
    summary: '',       // A short summary of what your command does.
    description: '',   // A verbose description of what your command can do.
    usage: '',         // Usage specifications.
    authors: [''],     // People who originally created the command. Use format: <user.handle>@

    operators: {       // Optional: define valid operators that your command accepts. Affects the "matchability" of input to your command (i.e. inputs with an operator not defined here will fail a match).
      "operator_name"  // Name of the operator. Only letters please ([a-z]). Common suggestions: new, search, del, update
      :
      "operator_desc"  // Human-readable description explaining the purpose of the operator
    },

    aliases: {         // Optional: provides alternative ways to match user input to your command and manipulate . When matched against the regex in the key, your command is re-invoked with replaced pattern in the value as the argument list.
      "regexp_string"  // key: Used as a regex pattern to match against the raw input string.
      :
      "replace_string" // val: used as the replacement pattern on the matched regex from the key. Supports capture group replacements.
    },

    run: function (inputArg, inputOps, inputRaw) {
      // The business logic of your command.
      // This function receives a String arguments (safe to assume trim() applied).
      // In the typical scenario, your subroutine completes with a redirection to a URL. In this case, simply return a URL string and rabbit2 will execute the redirection.
      // The this context of this function is the rabbit2 object.
      // For more advanced cases (e.g. serving text/json, etc.), the Express response object is made available through this.serverResponse giving you full control over to how handle requests.
      // Note: _YOU NEED TO_ serve a response to the server if your function doesn't return a URL string.
  
      // rabbit2 API:
      // - this.renderView( [dataObj] )          // serve a webpage using a view by the same name under `/views`, optionally passing it data
      // - this.storage( [key, [val]] )          // allow commands to have persistent storage
      // - this.cookie( name, [value, [ttl]] )   // set/get cookie values, namespaced to the command
      // - this.urlise( urlString )              // useful for commands needing to validate if user input is a valid URL
      // - this.escapeRegexString( regexString ) // useful for commands that use user input in regex matching
      //
      // - this.commandDirectory
      // - this.execSuggest( intentTokens )  // cmdStr, opsArr, argStr, rawStr
      // - this.execRun( intentTokens )      // cmdStr, opsArr, argStr, rawStr
    },

    suggest: async function (inputString) {
      // Serve search result suggestions.
      // Typically called as a user is typing in real-time, so make it fast!
      // This function will receive an array of white-space-tokenised arguments.
      // The this context of this function is the rabbit2 object.
      // Return an array of objects:
      // [
      //   {
      //     text: "", // supports formatting: <match>, <dim>, <url>
      //     url: ""
      //   },
      //   ...
      // ]
    }
  }

  */
};


/**
 * Builds the full directory of commands from files or folders within this directory.
 * The name of the directory or file is used as the unique identifier for the command (lowercased).
 * If the filename contains a dot, only the name before the first dot is used.
 */
fs.readdirSync(__dirname).forEach(file => {
  const [fileName] = path.parse(file).name.toLowerCase().split(".");

  if (fileName === 'index') {
    return;
  }

  var cmdObj = require(`${__dirname}/${file}`);

  // Inject/force the proper id (equivalent to its filename).
  cmdObj.id = fileName;

  // Sanitise parameters.
  cmdObj.name = cmdObj.name || "";
  cmdObj.summary = cmdObj.summary || "";
  cmdObj.description = cmdObj.description || "";
  cmdObj.usage = cmdObj.usage || "";
  cmdObj.authors = (typeof cmdObj.authors === "string"
    ? cmdObj.authors.split(/,\s*/)
    : cmdObj.authors
  ) || [];
  cmdObj.operators = cmdObj.operators ? cmdObj.operators : {};
  cmdObj.aliases = cmdObj.aliases ? cmdObj.aliases : {};
  cmdObj.run = typeof cmdObj.run === "function"
    ? cmdObj.run
    : false
  ;
  cmdObj.suggest = typeof cmdObj.suggest === "function"
    ? cmdObj.suggest
    : false
  ;

  cmdDirectory[fileName] = Object.freeze(cmdObj);
});

module.exports = Object.freeze(cmdDirectory);
