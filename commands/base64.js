
module.exports = {

  name: 'Base64',
  summary: 'Base64 encoder/decoder',
  description: 'Base64 encodes/decode a provided string.',
  usage: 'base64|atob|btoa {input}',
  authors: ['paulo.avila@'],

  aliases: {
    "atob\\s+" : "",
    "btoa\\s+" : "-d ",
  },

  run: function (inputArg) {
    var argTokens = inputArg.split(/^-d\s+/);
    var processedString = '';

    // Encode ==> ['hello   world  ']
    if (argTokens.length === 1) {
      processedString = Buffer.from(argTokens[0]).toString('base64');
    }
    // Decode ==> ['', 'aGVsbG8gd29ybGQ=']
    else {
      argTokens.shift();
      processedString = Buffer.from(argTokens[0], 'base64').toString('ascii');
    }

    // Serves a page which displays the encoded string along with a convinient "copy to clipboard" button
    this.renderView({ processedString: processedString });
    // return processedString;
  },

};
