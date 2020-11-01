
module.exports.invokeCommand = function (intentCmd, intentArgs) {
  const cmdDirectory = require('./commands');

  intentArgs = intentArgs || [];

  const cmdObj = cmdDirectory[intentCmd.toLowerCase()];

  // Checks for a _literal_ match of the intended command.
  if (cmdObj !== undefined) {
    var redirectUrl = cmdObj.exec(intentArgs);

    this.incrementCmdUsageCount(intentCmd);

    // If the command returns a URL, redirect to it.
    if (redirectUrl !== undefined) {
      this.serverResponse
        .set('x-rabbit2-cmd', intentCmd)
        .set('x-rabbit2-arg', intentArgs)
        .redirect(redirectUrl);
    } else {
      // Expectation is that the cmd's exec function sends a server response.
    }

    return;
  }

  // Checks for an _alias_ match (regex-based) of intended command.
  // If matched, the matched string is replaced with the specified replace pattern
  // and is passed as the argument invoked on the same command.
  for (let [cmdKey, cmdObj] of Object.entries(cmdDirectory)) {
    for (let [aliasRegexString, replacePattern] of Object.entries(cmdObj.aliases)) {
      let fullIntent = `${intentCmd} ${intentArgs.join(' ')}`.trim();
      let regexp = new RegExp(aliasRegexString);

      if (fullIntent.match(regexp)) {
        let replacedArgs = fullIntent.replace(regexp, replacePattern).split(' ');

        this.invokeCommand(cmdKey, replacedArgs);

        return;
      }
    }
  }

  // If there's no match for the command, treat the original intent (cmd + args) as if it were a Google search.
  intentArgs.unshift(intentCmd);
  this.invokeCommand('google', intentArgs);

  // // If command doesn't exist, respond with a 400.
  // this.serverResponse
  //   .status(400)
  //   .send(`<b>${intentCmd}</b> not found.<br>Try <a href="/?list"><b>list</b>ing</a> all available commands.`);

  return;
}


/**
 * Increments the usage counter {cmd}.
 */
module.exports.incrementCmdUsageCount = function (cmd) {
  const fs = require('fs');
  const path = './.data/cmdUsageCount.json';

  var db = JSON.parse(fs.readFileSync(path));

  var count = db[cmd] || 0;
  db[cmd] = count + 1;

  fs.writeFileSync(path, JSON.stringify(db));
}
