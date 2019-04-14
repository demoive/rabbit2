# bunny1js

**bunny1js** is:

- 🧐 An extensible, universal task runner.
- 🤓 Custom server-side subroutines, invoked through a query parameters.
- 😇 A replica of the `bunny1.org` concept but in Node.js!
- **🤖 A configurable bot to do your bidding, summoned in your browser.**

Its true utility becomes is exponential when individuals can extend and customise the commands to suit their needs.

## Installation

The intended use case:

1. Deploy this project to your own server for internally in an organisation.
2. Set it up as a default "search engine" in your browser to facilitate its use.

### 1. Server

After downloading the project, `npm init` in the root directory should be all it takes to get your going. The URL you set up for the server should only be accessible on a LAN or VPN. Why, because this isn't intended to be a public resource, we already have [yubnub](https://yubnub.org/) for that.

### 2. Browser shortcut

With your server up and running, you can already access bunny1. Since people are meant to access it through their browser's address bar, set up bunny1 as a "search engine" in your browser.

#### Google Chrome

Go to: **Settings > Search Engine > Manage > Add** (`chrome://settings/searchEngines`):

- Name: `bunny1`
- Keyword: `/` (or whatever your want)
- URL: `https://{YOUR_SERVER_URL}?%s`

![Add a default search engine in Google Chrome](https://cdn.glitch.com/40653988-407c-4934-b535-6d482ecc2bcb%2Finstall-chrome-search-engine.png?1555275767656 "New Search Engine")

For power users, make bunny1 the default search engine to avoid having to use your **keyword** to access bunnyjs.
Because the default fall-back of bunny1js when it doesn't find a matching cmd is to perform a Google search, this is typically a safe choice.

![Set the default search in Google Chrome](https://cdn.glitch.com/40653988-407c-4934-b535-6d482ecc2bcb%2Finstall-chrome-search-engine-default.png?1555275767909 "Default search engine")

#### Firefox

#### Safari

### Objectives

- Utility
- Simplicity
- Extensibiliy

---

## FAQ

### How can I make my own commands?

Use the commented sample code in `cmd.js`. Define your own unique command name and mini-function which will be executed when someone calls your command (optionally with arguments). If your function returns a URL string, bunny1 redirects to it.

There's not much else beyond that -- which is what is so great!

### How does this work?

This project is a collection of mini-subroutines, invoked by a command and option arguments. The typical purpose of the functions is to redirect to specific URL or alternatively returning some useful information.

If you've ever used a command-line on your computer, it's pretty much just like that except in your browser and on the Internet.

_Think of this as a "chat bot" for your browser._

### Isn't this just like the original bunny1.org?

Umm, yes. Kind of. But differing in these two ways:

1. bunny1js is in Node.js (more wide-spread accessible to the web masses)
2. Provides slightly more flexibility to the commands, supporting regex-based aliases which allows you to do magical things like: target an intent directly with the arguments, without needing a `cmd` prefix.

   For example, you can configure an alias like `j1234` or even just `1234` which map to `jira PROJ-1234`.

Internally at Facebook, `bunny1` is called `bunnylol` and its been extended with this same type of dynamic cabability. `bunny1js` brings this same concept in a more modern, sharable way.

### Why not make this a public resource?

I won't stop you. But keep in mind that [yubnub](https://yubnub.org/) already exists. Secondly, there are often URLs and functionality that organisations want/need to keep private. This project enables you to spin this up for your organisation with low effort. You can change the fall-back when a command isn't found to hit yubnub (this is the behaviour of the original bunny1.org) so that anything you don't define explicitely makes use of their extensive repository of commands.

## Credits

Created by [Paulo Avila](https://github.com/demoive). The author of the original [bunny1](https://github.com/ccheever/bunny1/) is Charlie Cheever. Julie Zhuo made the blob bunny logo.

---

- Todo
  - respect whitespace in arguments
  - add meta commands?
  - contributing (in readme and separate file).
  - replace logging with cmd counter
  - remove pug dependency?
  - render markup2html for readme? or a homepage?
  - Installation instructions for firefox, safari.
  - change `cmdDirectory` to individual objects added to module.exports;
