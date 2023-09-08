
module.exports = {

  name: 'Echo',
  summary: 'Feeling lonely?',
  description: 'Returns back what you give to it.',
  usage: 'echo {string}',
  authors: ['paulo.avila@'],

  run: function (inputArg) {
    //return inputArg;
    this.renderView({ inputString: inputArg });
  },

};
