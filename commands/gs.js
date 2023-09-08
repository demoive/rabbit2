const REDIRECT_URL = 'https://cloudsearch.google.com/cloudsearch';
const REDIRECT_URL_SEARCH = 'https://cloudsearch.google.com/cloudsearch/search';
const REDIRECT_URL_SEARCH_FILTER_QUERY_PARAM = 'tnm';

var cmdOptSearchFilterMapping = {
  "e": "mail",
  "d": "docs",
  "s": "sites",
  "g": "grps",
  "c": "cal",
};

var cmdOpts = Object.keys(cmdOptSearchFilterMapping);

var aliases = {};
// aliases['gs$'] = "";
// aliases['gs\\s+'] = "";
aliases[`gs(${cmdOpts.join('|')})\\s+`] = "-$1 ";


module.exports = {

  name: 'Google Workspace search',
  summary: 'Search Gmail/Drive/Calendar/Groups/etc.',
  description: 'Search across your entire Google Workspace, with optional filters.',
  usage: 'gs|gs' + cmdOpts.join('|gs') + ' {search}',
  authors: ['paulo.avila@'],

  aliases: aliases,

  run: function (inputArg) {
    if (!inputArg) {
      return REDIRECT_URL;
    }
    
    var inputArgTokens = inputArg.split(/\s+/);

    // Handle if the first argument is a valid command option.
    var optionCodeRegEx = new RegExp(`^-(${cmdOpts.join('|')})$`);
    var cmdOptTest = optionCodeRegEx.exec(inputArgTokens[0]);

    var searchUrl = `${REDIRECT_URL_SEARCH}?`;

    if (cmdOptTest && inputArgTokens.length >= 2) {
      inputArgTokens.shift();

      searchUrl = `${searchUrl}${REDIRECT_URL_SEARCH_FILTER_QUERY_PARAM}=${cmdOptSearchFilterMapping[cmdOptTest[1]]}&`;
    }

    var searchTerms = encodeURIComponent(inputArgTokens.join(' '));

    return `${searchUrl}q=${searchTerms}`;
  },

};
