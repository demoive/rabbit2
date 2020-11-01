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
aliases['^gs$'] = "";
aliases['^gs\\s+'] = "";
aliases[`^gs(${cmdOpts.join('|')})?\\s+`] = "-$1 ";


module.exports = {

  desc: 'Global / G Suite search. Searches across your entire Google Workspace, with optional filters.',

  usage: 'gsuite|gs|gs' + cmdOpts.join('|gs') + ' [{search_terms}]',

  aliases: aliases,

  exec: function (args) {
    var cmdArgs = args.slice(); // Shallow copy of the args array (for a possible manipulation later).

    var searchUrl = `${REDIRECT_URL_SEARCH}?`;

    if (cmdArgs.length === 0) {
      return REDIRECT_URL;
    }

    // Handle if the first argument is a valid command option.
    var optionCodeRegEx = new RegExp(`^-(${cmdOpts.join('|')})$`);
    var cmdOptTest = optionCodeRegEx.exec(cmdArgs[0]);

    if (cmdOptTest && cmdArgs.length >= 2) {
      cmdArgs.shift();

      searchUrl = `${searchUrl}${REDIRECT_URL_SEARCH_FILTER_QUERY_PARAM}=${cmdOptSearchFilterMapping[cmdOptTest[1]]}&`;
    }

    var searchTerms = encodeURIComponent(cmdArgs.join(' '));

    return `${searchUrl}q=${searchTerms}`;
  },

};
