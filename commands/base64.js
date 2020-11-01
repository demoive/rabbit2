
module.exports = {

  desc: 'Base64 encodes/decode a provided string.',

  usage: 'base64|b64|b64d {source_string}',

  aliases: {
     "^b64\\s+" : "",
     "^atob\\s+" : "",
     "^b64d\\s+" : "-d ",
     "^btoa\\s+" : "-d ",
  },

  run: function (runData) {
    var sourceString = '';
    var processedString = '';

    if (runData.args.length >= 2 && runData.args[0] === '-d') {
      sourceString = runData.argString.replace(/^\s*-d\s/, '');
      processedString = Buffer.from(sourceString, 'base64').toString('ascii');
    }

    else {
      processedString = Buffer.from(runData.argString).toString('base64');
    }

    runData.serverResponse.send(processedString);
  },

};
