
module.exports.invokeCommand = function (runData) {
  const cmdDirectory = require('./commands');

  const cmdObj = cmdDirectory[runData.cmd];

  // Checks for a _literal_ match of the intended command.
  if (cmdObj !== undefined) {
    var redirectUrl = cmdObj.run(runData);

    // If the command returns a URL, redirect to it.
    if (redirectUrl !== undefined) {
      runData.serverResponse
        .set('x-rabbit2-cmd', runData.cmd)
        .set('x-rabbit2-arg', runData.args)
        .redirect(redirectUrl);
    } else {
      // Expectation is that the cmd's exec function sends a server response.
      // Perhaps we can send a generic (error?) response here as a fallback.
    }

    return;
  }

  // Checks for an _alias_ match (regex-based) of intended command.
  // If matched, the matched string is replaced with the specified replace pattern
  // and is passed as the argument invoked on the same command.
  for (let [cmdKey, cmdObj] of Object.entries(cmdDirectory)) {
    for (let [aliasRegexString, replacePattern] of Object.entries(cmdObj.aliases)) {
      let regexp = new RegExp(aliasRegexString);

      if (runData.fullIntentString.match(regexp)) {
        let replacedArgs = runData.fullIntentString.replace(regexp, replacePattern);

        runData['cmd'] = cmdKey;
        runData['args'] = replacedArgs.split(' ');
        runData['argString'] = replacedArgs;

        this.invokeCommand(runData);

        return;
      }
    }
  }

  // If there's no match for the command, treat the original intent as if it were a Google search.
  this.invokeCommand('google', runData.fullIntentString);

  // // If command doesn't exist, respond with a 400.
  // runData.serverResponse
  //   .status(400)
  //   .send(`<b>${runData.cmd}</b> not found.<br>Try <a href="/?list"><b>list</b>ing</a> all available commands.`);

  return;
}


/**
 * Rudimentary logging of commands. Mostly for investigation purposes.
 *
 * Should be turned into a simple/efficient counter to show the most popular commands.
 */
module.exports.logCommandUsage = function (cmd, args) {
  const fs = require('fs');
  var logStream = fs.createWriteStream('log.txt', {'flags': 'a'}); // 'a' to append and 'w' to erase and write a new file

  const now = new Date().toISOString();

  logStream.write(`${now} ${cmd} ${args.join(' ')}\n`);
}
