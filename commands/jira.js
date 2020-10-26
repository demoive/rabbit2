const JIRA_BASE_URL = 'https://glovoapp.atlassian.net'; //https://jira.atlassian.net
const COOKIE_JIRA_PREV_PROJ_KEY = 'rabbit2-jira-key-prev';


module.exports = {

  desc: `Go to a specific Jira issue.`,

  usage: 'jira {full_key} | {full_key} | j{key_number} | {key_number}</code>',

  aliases: {
    "^([A-Z]+-\\d+)$"    : "$1",
    "^j(?:\\s*(\\d+))?$" : "$1",
    "^(\\d{1,5})$"       : "$1",
  },

  exec: function (args) {
    var jiraProjTokens = /^([A-Z]+)?-?(\d+)?$/.exec(args[0]);

    if (args.length === 0 || !jiraProjTokens) {
      return `${JIRA_BASE_URL}/`;
    }

    const rabbit2 = require('../rabbit2');

    var jiraProjKey = jiraProjTokens[1] || rabbit2.serverRequest.cookies[COOKIE_JIRA_PREV_PROJ_KEY];
    var jiraProjNum = jiraProjTokens[2] || '';

    // If we can't determine a project key, prompt for it.
    if (!jiraProjKey) {
      // Serves a page which prompts (via JS) for the JIRA key and recalls `rabbit2 jira {key}-{number}`.
      rabbit2.serverResponse.render('jira', { issueNumber: jiraProjNum });

      return;
    }

    if (jiraProjKey !== undefined) {
      // Save the used Jira project key in a cookie.
      rabbit2.serverResponse.cookie(COOKIE_JIRA_PREV_PROJ_KEY, jiraProjKey, {
        maxAge: 31556952000, // 1 year.
        httpOnly: true       // Disables accessing cookie via client side JS.
      });
    }

    var jiraProjIssue = jiraProjNum
      ? `${jiraProjKey}-${jiraProjNum}`
      : jiraProjKey
    ;

    return `${JIRA_BASE_URL}/browse/${jiraProjIssue}`;    
  },

};
