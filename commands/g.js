
module.exports = {

  name: 'Google',
  summary: 'Google & Lucky search',
  description: 'Pipes your input directly to a Google search or Google lucky search.',
  usage: 'g|gl|google {search}',
  authors: ['paulo.avila@'],

  aliases: {
    "gl\\s+" : "-l ",
    "google$" : "",
    "google\\s+" : "",
  },

  run: function (inputArg) {
    var redirectUrl = new URL('https://www.google.com/search');

    var argTokens = inputArg.split(/^-l\s+/);

    if (argTokens.length > 1) {
      // These parameters force a "I'm feeling lucky" search/redirect.
      // Doesn't seem to always work, depending on the search query 🤷
      redirectUrl.searchParams.set('btnI', '');
      redirectUrl.searchParams.set('sourceid', 'navclient');
      redirectUrl.searchParams.set('gfns', '1');
      argTokens.shift();
    }

    redirectUrl.searchParams.set('q', argTokens[0]);

    return redirectUrl.href;
  },

};
