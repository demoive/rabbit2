
module.exports = {

  desc: 'Returns back what you give to it.',

  usage: 'echo {content_to_reply}',

  aliases: {
  },

  run: function (runData) {
    runData.serverResponse.send(runData.argString);
  },

};
