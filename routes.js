
/**
 * Root of the server.
 * Invoke commands specified by a query string.
 * If no query string, shows a list of available commands.
 */
module.exports.commandTriage = function (req, res) {
  //const intentString = req.params.intent; // /i/:intent
  const URL = require('url');

  const rabbit2 = require('./rabbit2');
  rabbit2.serverRequest = req; // Expose the server's request object in rabbit2.
  rabbit2.serverResponse = res; // Expose the server's response object in rabbit2.

  // Sometimes query strings arrive with pluses for spaces.
  // This ensures all pluses are encoded correctly so that the decode functions works as expected.
  const queryStringPluses = URL.parse(req.url).query || '';
  const queryStringEncoded = queryStringPluses.replace(/\+/g, '%20');
  const intentString = decodeURIComponent(queryStringEncoded);

  if (!intentString) {
    //res.sendFile(__dirname + '/README.md');
    rabbit2.invokeCommand('list');
    return;
  }

  // Tokenise the intent to extract the command and possible arguments.
  var intentArgs = intentString.split(/\s+/);
  var intentCmd = intentArgs.shift();

  rabbit2.invokeCommand(intentCmd, intentArgs);
}


/**
 * Returns the command directory as a JSON.
 */
module.exports.commandDirectoryJson = function (req, res) {
  const cmdDirectory = require('./commands');

  res.json(cmdDirectory);
}
