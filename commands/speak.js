
module.exports = {

  name: 'Speak',
  summary: 'Text to speech',
  description: 'Dictate the provided text, in different languages/voices.',
  usage: 'speak {text}',
  authors: ['paulo.avila@'],

  run: function (inputArg) {
    this.renderView({
      stringToDictate: inputArg.trim().split(/\s+/).join(' ')
    });
  },

};
