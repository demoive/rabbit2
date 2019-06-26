
module.exports = {

  desc: 'Returns back what you give to it.',

  usage: 'echo {content_to_reply}',

  aliases: {
  },

  exec: function (args) {
    const rabbit2 = require('../rabbit2');
    rabbit2.serverResponse.send(args.join(' '));
  },

};
