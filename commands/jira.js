const JIRA_BASE_URL = 'https://jira.atlassian.net';
const JIRA_PRINCIPLE_PROJECT_KEY = 'PROJ';

module.exports = {

  desc: `Go to a specific Jira issue.`,

  usage: 'jira {full_key} | j{key_number} | {key_number}</code>',

  aliases: {
    "^([A-Z]+-\\d+)$"    : "$1",
    "^j(?:\\s*(\\d+))?$" : `${JIRA_PRINCIPLE_PROJECT_KEY}-$1`,
    "^(\\d{1,5})$"       : `${JIRA_PRINCIPLE_PROJECT_KEY}-$1`,
  },

  exec: function (args) {
    var issueId = encodeURIComponent(args.join(' '));

    return `${JIRA_BASE_URL}/browse/${issueId}`;
  },

};
