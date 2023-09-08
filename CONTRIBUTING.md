[//]: # (https://gist.github.com/PurpleBooth/b24679402957c63ec426)
[//]: # (https://gist.github.com/briandk/3d2e8b3ec8daf5a27a62)
[//]: # (https://guides.github.com/introduction/flow/index.html)

## New Commands

Creating a new command is simple:

- Create a new file in `/commands`.
- Refer to the expected structure/fields documented in `/commands/index.js`.
- It may help copy an existing command as a starting point.
- That's it!

### Tips

- Keep the file name short and only use lowercase _letters_ -- it's used as the identifer for the command and what people will type.
- Include all the relevant meta data: `name`, `summary`, `description`, `usage`, `author`, ...
- Use `process.env.VARIABLE` to avoid any identifiable information in your file (e.g. URls or other sensitive data).
- If you think other organisations could use your command (i.e. it's generic enough), please submit a pull request to the main repo: `https://github.com/demoive/rabbit2`.

## Core functionality

For code contributions, submit pull requests to `https://github.com/demoive/rabbit2`.
