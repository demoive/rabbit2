const CLICKUP_PROJ_BASE_URL = 'https://app.clickup.com';
const CLICKUP_WORKSPACE_ID = '';
const COOKIE_CLICKUP_PREV_PROJ_KEY = 'proj-key-prev';


module.exports = {

  name: 'ClickUp',
  summary: `Shortcut to a ClickUp issue`,
  description: `Go to a specific ClickUp issue or to your Workspace's default view.`,
  usage: 'clickup|cu [[{key}] {number}]',
  authors: ['paulo.avila@'],

  aliases: {
    "cu$" : "",
    "(?:cu\\s+)?([a-zA-Z]+-\\d+)$" : "$1", // "cu KEY-1234" or "KEY-1234"
    "(?:cu\\s+)?(\\d{1,5})$" : "$1", // "cu 1234" or "1234"
  },

  run: function (inputArg) {
    var projTokens = /^(?:([a-zA-Z]+)[- ])?(\d+)$/i.exec(inputArg); // KEY-1234 OR 1234

    if (!inputArg || !projTokens) {
      return `${CLICKUP_PROJ_BASE_URL}/${CLICKUP_WORKSPACE_ID}`;
    }

    var projKey = projTokens[1] || this.cookie(COOKIE_CLICKUP_PREV_PROJ_KEY);
    var projNum = projTokens[2] || '';

    // If we can't determine a project key, prompt for it.
    if (!projKey) {
      // Serves a page which prompts (via JS) for the ClickUp key and recalls `rabbit2 clickup {key}-{number}`.
      this.renderView({ issueNumber: projNum });

      return;
    }

    // We have a project key by this point.

    // ClickUp is case sensitive.
    projKey = projKey.toUpperCase();

    // Save the project key in a cookie.
    this.cookie(COOKIE_CLICKUP_PREV_PROJ_KEY, projKey);

    return `${CLICKUP_PROJ_BASE_URL}/t/${CLICKUP_WORKSPACE_ID}/${projKey}-${projNum}`;    
  },

};
