
const bunny1 = require('./bunny1');

module.exports = function (app) {

  // Root of the server.
  // Invoke commands by specify a query string.
  // If no query string, serves a helpful page (README).
  app.route('/')
    .get(function (req, res) {
      //const intentString = req.params.intent; // /i/:intent
      const URL = require('url');

      // Sometimes query strings arrive with pluses for spaces.
      // This ensures all pluses are encoded correctly so that the decode functions works as expected.
      const queryStringPluses = URL.parse(req.url).query || '';
      const queryStringEncoded = queryStringPluses.replace(/\+/g, '%20');
      const intentString = decodeURIComponent(queryStringEncoded);

      if (!intentString) {
        res.sendFile(__dirname + '/README.md');
        return;
      }

      // Tokenise the intent to extract the command and possible arguments.
      var intentArgs = intentString.split(/\s+/);
      var intentCmd = intentArgs.shift();

      bunny1.serverResponse = res; // Expose the server's response object in bunny1.
      bunny1.logCommandUsage(intentCmd, intentArgs);
      bunny1.invokeCommand(intentCmd, intentArgs);
    });

};
