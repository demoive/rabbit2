
module.exports = {

  desc: `Go to a specific Jira issue or to your project's default view.`,

  usage: 'jira [{proj_key}|{full_issue_code}] | {full_issue_code} | {issue_number}</code>',

  aliases: {
    "^([A-Z]+-\\d+)$"    : "$1",
    //"^j(?:\\s*(\\d+))?$" : "$1",
    "^(\\d{1,5})$"       : "$1",
  },

  exec: function (args) {
    const COOKIE_JIRA_PREV_PROJ_KEY = 'rabbit2-jira-key-prev';

    var jiraBaseUrl = process.env.JIRA_BASE_URL; //https://jira.atlassian.net

    var jiraProjTokens = /^([A-Z]+)?-?(\d+)?$/.exec(args[0]);

    if (args.length === 0 || !jiraProjTokens) {
      return `${jiraBaseUrl}/`;
    }

    const rabbit2 = require('../rabbit2');

    var jiraProjKey = jiraProjTokens[1] || rabbit2.serverRequest.cookies[COOKIE_JIRA_PREV_PROJ_KEY];
    var jiraProjNum = jiraProjTokens[2] || '';

    // If we can't determine a project key, prompt for it.
    if (!jiraProjKey) {
      // Serves a page which prompts (via JS) for the JIRA key and recalls `rabbit2 jira {key}-{number}`.
      rabbit2.serverResponse
        // .set('x-rabbit2-cmd', 'jira')
        // .set('x-rabbit2-arg', args)
        .render('jira', { issueNumber: jiraProjNum });

      return;
    }

    // We have a project key by this point.

    // Save the Jira project key in a cookie.
    rabbit2.serverResponse.cookie(COOKIE_JIRA_PREV_PROJ_KEY, jiraProjKey, {
      maxAge: 31556952000, // 1 year.
      httpOnly: true       // Disables accessing cookie via client side JS.
    });

    var jiraRedirectionDestination = jiraProjNum
      ? `${jiraProjKey}-${jiraProjNum}`
      : jiraProjKey
    ;

    return `${jiraBaseUrl}/browse/${jiraRedirectionDestination}`;    
  },

};
