
module.exports = {

  desc: 'Base64 encodes/decode a provided string.',

  usage: 'base64|b64|b64d {source_string}',

  aliases: {
     "^b64\\s+" : "",
     "^atob\\s+" : "",
     "^b64d\\s+" : "-d ",
     "^btoa\\s+" : "-d ",
  },

  exec: function (args) {
    const rabbit2 = require('../rabbit2');

    var argTokens = args.slice(); // Shallow copy of the args array (for a possible manipulation later).
    var sourceString = '';
    var processedString = '';

    if (argTokens.length >= 2 && argTokens[0] === '-d') {
      argTokens.shift();
      sourceString = argTokens.join(' ');
      processedString = Buffer.from(sourceString, 'base64').toString('ascii');
    }

    else {
      sourceString = argTokens.join(' ');
      processedString = Buffer.from(sourceString).toString('base64');
    }

    rabbit2.serverResponse.send(processedString);
  },

};
