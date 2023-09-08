
module.exports = {

  name: 'Google Drive',
  summary: 'Search your Google Drive',
  description: 'Shortcut to your Google Drive, optionally with search parameters.',
  usage: 'drv [{search}]',
  authors: ['paulo.avila@'],

  operators: {
  },

  run: function (inputArg) {
    if (!inputArg) {
      return 'https://drive.google.com/drive/my-drive';
    }

    // https://docs.google.com/document/create?title=My%20Amazing+Title
    // https://docs.google.com/spreadsheets/create
    // https://docs.google.com/presentation/u/0/create?usp=dot_new
    // https://docs.google.com/presentation/create?title=My%20Amazing+Title
    // https://docs.google.com/forms/create?title=My%20Amazing+Title
    // https://calendar.google.com/calendar/u/0/r/eventedit?add=paulo.avila@factorial.co
    // https://mail.google.com/mail/u/0/?tf=cm&to=paulo.avila@factorial.co
    
    var searchString = encodeURIComponent(inputArg);

    return `https://drive.google.com/drive/search?q=${searchString}`;
  },

};
