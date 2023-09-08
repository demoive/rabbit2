# rabbit2

Programmable command shortcuts for your browser.

At work, we live in the browser -- so much of what we do starts with opening a new tab and typing something into the search bar. What if the browser location bar allowed us to do more than just search Google or bring up a history of websites we've visited before?

Meet rabbit2: A tool enabling people to simplify and automate most common/daily actions in browser -- bootstraping efficiency.

## Installation

The intended use case involves two separate steps:

1. Deploy this project to your own server, preferably in your organisation's internal network.
2. Set up your new server as a "search engine" in your browser's settings.

### 1. Deploying on your server

#### Development

In Glitch, you don't have to do anything! Just go to the URL for your project (`https://rabbit2.glitch.me/`).

To run locally, download the project and in the root directory run the following:

```
npm install
npm start
```

#### Production

Each server environment has their own steps to deploy. As this project is set up for use with Firebase, here are the commands for deploying to Firebase. Execute these from the Glitch Console:

```
npm install -g firebase-tools
firebase login --no-localhost
firebase init functions
firebase deploy --only functions -m "Deploying the best new feature ever."
```

The URL you set up for the server _should_ only be accessible on a LAN or VPN. Why? Because this isn't intended to be a public resource, we already have [yubnub](https://yubnub.org/) for that.

### 2. Browser shortcut

With your server up and running you can already access rabbit2. People are meant to access it through their browser's address bar so they should set up rabbit2 as a "search engine" in their browser.

#### Google Chrome

Go to: **Settings > Search Engine > Manage > Add** (`chrome://settings/searchEngines`):

- Name: `🐇` or `rabbit2`
- Keyword: `/` (or whatever your want)
- URL: `https://{YOUR_SERVER_URL}?%s`

![Add a default search engine in Google Chrome](https://cdn.glitch.com/40653988-407c-4934-b535-6d482ecc2bcb%2Finstall-chrome-search-engine.png?v=1561110198292 "New Search Engine")

For power users, make rabbit2 the _default_ search engine. This saves you the trouble of typing your command keyword (`/`) followed by tab in order to access rabbit2. Since rabbit2 falls back to a Google search when it doesn't recognise a command, this is typically a safe choice.

![Set the default search in Google Chrome](https://cdn.glitch.com/40653988-407c-4934-b535-6d482ecc2bcb%2Finstall-chrome-search-engine-default.png "Default search engine")

#### Firefox

Coming soon...

#### Safari

Coming soon...

[//]: # (### Objectives: Utility, Simplicity, Extensibiliy)

---

## Contributing

Gotcha [covered here](./CONTRIBUTING.md).

## FAQ

### What exactly is this?

I know, it's a bit of strange concept. It's similar to slash-commands in [Slack](https://api.slack.com/slash-commands) or [Telegram](https://core.telegram.org/bots#commands) but accessible in _any_ browser bar. Plus, it's much easier to create and customise.

Debatably, all of these are ways to describe this tool:

- 💬 A one-time "chat bot" with the entire Internet.
- 🤖 A configurable bot, summoned in your browser.
- 💻 A command line prompt for your location bar.
- 🤓 Custom server-side subroutines, invoked through query parameters.
- ↗️ Browser redirection service.
- ⚡️ Programmable browser shortcuts.
- 🧐 An extensible, universal task runner.
- 😇 A replica of the `bunny1.org` concept but in Node.js!

### How does this work?

On a technical level, this project is a ligthweight web server along with a collection of mini-subroutines. Pass a query string to the server root and that will identify which of these micro-functions to run (optionally, with arguments).

The typical behaviour of each command is to redirect to specific URL but their functionality can extend to conceivably anything. There's a good explanation and example use cases in [this blog post](http://www.ccheever.com/blog/?p=74) which speaks about the inspiration this project derives from, the original bunny1.

### Isn't this just like the original bunny1.org?

Umm, yes. Kind of. But differing in these two ways:

1. rabbit2 is in Node.js -- which I find is more wide-spread and accessible to the web masses. bunny1 is in Python.
2. rabbit2 provides slightly more flexibility to the commands, supporting regex-based aliases which allows you to do magical things like: target an intent directly with the arguments, without needing a `cmd` prefix.

   For example, you can configure an alias like `j1234` or even just `1234` which map to `jira PROJ-1234`. In fact, internally at Facebook, `bunny1` evolved to a tool called `lolbunny` which has this same type of dynamic cabability. `rabbit2` brings this same concept in a more modern, sharable way.

### How can I make my own commands?

The best way to get started is to copy an existing command. In order of complexity, have a look at:

- `commands/drv.js`: basic redirection functionality.
- `commands/google.js`: basic redirection and alias functionality.
- `commands/echo.js`: basic custom server response content.
- `commands/list.js`: advanced server response content (using a template page).
- `commands/jira.js`: advanced alias and cookie functionality.
- `commands/gsuite.js`: support for command options.

A more complete explanation of each part that makes up a command is documented in `commands/index.js`. Honestly, there's not much else beyond that. It's quite straightforward, simple and flexible!

The only files you should touch are:

```
commands/  # Place all the code for your command under one file here, using the example structure in index.js.
views/     # Commands that serve a page rather than redirect, use a file here with the same name as the command.
.env       # Add any information specific to your environment here.
.data/     # Persistent data storage.
```

### Why not make this a public service?

I won't stop you. But keep in mind that [yubnub](https://yubnub.org/) already exists ([more about its origins](http://jonaquino.blogspot.com/2005/06/yubnub-my-entry-for-rails-day-24-hour.html?m=1)). Secondly, there are often URLs and functionality that organisations want/need to keep private. This project enables you to spin this up for your organisation with low effort.

## Credits

Created by [Paulo Avila](https://github.com/demoive). The author of the original [bunny1](https://github.com/ccheever/bunny1/) is Charlie Cheever.
