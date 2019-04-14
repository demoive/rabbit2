// const fs = require('fs');
// const yaml = require('js-yaml');

module.exports.invokeCommand = function (intentCmd, intentArgs) {
  const cmdDirectory = require('./cmd');
  // try {
  //   cmdDirectory = yaml.safeLoad(fs.readFileSync('./cmd.yaml', 'utf8'));
  // } catch (e) {
  //   console.error(e);
  // }

  intentArgs = intentArgs || [];

  const cmdObj = cmdDirectory[intentCmd.toLowerCase()];

  // Checks for a _literal_ match of the intended command.
  if (cmdObj !== undefined) {
    var redirectUrl = cmdObj.exec(intentArgs);
    //this.logCommandUsage(intentCmd, intentArgs);
    
    // If the command returns a URL, redirect to it.
    if (redirectUrl !== undefined) {
      this.serverResponse
        .set('x-bunny1-cmd', intentCmd)
        .set('x-bunny1-arg', intentArgs)
        .redirect(redirectUrl);
    } else {
      // Expectation is that the cmd's exec function sends a server response.
    }

    return;
  }

  // Checks for an _alias_ match (regex-based) of intended command.
  // If matched, the matched string is replaced with the specified replace pattern
  // and this text is used as a single argument invoked on the same command.
  for (let [cmdKey, cmdObj] of Object.entries(cmdDirectory)) {
    for (let [aliasRegexString, replacePattern] of Object.entries(cmdObj.aliases)) {
      let fullIntent = `${intentCmd} ${intentArgs.join(' ')}`.trim();
      let regexp = new RegExp(aliasRegexString);

      if (fullIntent.match(regexp)) {
        let replacedArgs = fullIntent.replace(regexp, replacePattern).split();

        this.invokeCommand(cmdKey, replacedArgs);

        return;
      }
    }
  }

  // // If command doesn't exist, delegate it to yubnub.
  // intentArgs.unshift(intentCmd);
  // this.serverResponse.redirect(`https://yubnub.org/parser/parse?command=${intentArgs.join(' ')}`);

  // If command doesn't exist, treat it as if it were a Google search.
  intentArgs.unshift(intentCmd);
  this.invokeCommand('g', intentArgs);

  // // If command doesn't exist, respond with a 400.
  // this.serverResponse
  //   .status(400)
  //   .send(`<b>${intentCmd}</b> not found.`);

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
