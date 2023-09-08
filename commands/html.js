
module.exports = {

  name: 'HTML',
  summary: 'HTML renderer',
  description: 'Renders what you give to it as HTML.',
  usage: 'html {code}',
  authors: ['paulo.avila@'],

  run: function (inputArg) {
    this.renderView({ inputHtml: inputArg });
  },

};
