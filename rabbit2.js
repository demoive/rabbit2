const path = require('path');
const getCallerFile = require('get-caller-file');
const JSONdb = require('simple-json-db');

const rabbit2Db = new JSONdb('./.data/.rabbit2.json', {
  syncOnWrite: true,
  jsonSpaces: 0,
});

// Grabs the db from disk into memory.
var rabbit2MemDb = rabbit2Db.JSON();



/**
 * Object representation of all available commands and their properties.
 * Refer to /commands/index.js for the supported structure.
 */
module.exports.cmdDirectory = require('./commands');



/**
 * Executes the `run()` function of the appropriate command as specified in `inputParams`,
 * which is determined by one of either of the following sequentially:
 *
 * - An exact match on the command's filename (as per `inputParams.cmdStr`) and valid operators (as per `inputParams.opsArr`).
 * - The resolved command from a match on any commands' aliases regex pattern matches, recursive invocation of this function ⤴️.
 * - Fallback: the `g` (Google) command with the `inputParams.rawStr` as its input.
 *
 * @param {Object} inputParams all possible tokens from the user input (cmdStr, opsArr, argStr, rawStr)
 * @returns {string} the return value of the command's run() function.
 */
module.exports.execRun = async function (inputParams) {
  console.log(inputParams);
  const inputCmd = inputParams.cmdStr;
  const inputOps = inputParams.opsArr;
  const inputArg = inputParams.argStr;
  const inputRaw = inputParams.rawStr;

  const cmdObj = this.cmdDirectory[inputCmd];

  // Case 1: Command exists with an _exact_ match of the `inputCmd.inputOps` input.
  if (cmdObj && typeof cmdObj.run === "function") {
    if (cmdObj.operators && inputOps.every(op => Object.keys(cmdObj.operators).includes(op))) {
      incrementRunCount.call(this, inputCmd);

      return await cmdObj.run.call(this, inputArg, inputOps, inputRaw);
    }
  }

  // Case 2: Attempt to find a command with an _alias_ match of the raw input.
  // We replace a match with its replace pattern and pass it as the argument to the target command.
  for (let [cmdKey, cmdObj] of Object.entries(this.cmdDirectory)) {
    for (let [aliasRegexString, replacePattern] of Object.entries(cmdObj.aliases)) {
      // Make the regex a little safer.
      if (aliasRegexString.charAt(0) !== '^') {
        aliasRegexString = `^${aliasRegexString}`;
      }

      let regexp = new RegExp(aliasRegexString);

      if (regexp.test(inputRaw)) {
        let replacedArgString = inputRaw.replace(regexp, replacePattern);

        return this.execRun({
          cmdStr: cmdKey,
          opsArr: inputOps, // Blindly forwarded from the original parse.
          argStr: replacedArgString,
          rawStr: inputRaw,
        });
      }
    }
  }

  // Case 3: No suitable matches, so pipe the original raw input to a Google search.
  // We invoke the command's run() directly to avoid incrementing the run counter for the `g` command.
  incrementRunCount.call(this); // Without a cmdId parameter, counts towards "no match" (Google search implied).
  return this.cmdDirectory['g'].run.call(this, inputRaw, inputOps, inputRaw);
}






/**
 * 
 */
module.exports.execSuggest = async function (inputParams) {
  const inputCmd = inputParams.cmdStr;
  //const inputOps = inputParams.opsArr;
  // const inputArg = inputParams.argStr;
  const inputRaw = inputParams.rawStr;

  const cmdObj = this.cmdDirectory[inputCmd];

  if (cmdObj && typeof cmdObj.suggest === "function") {
    return await cmdObj.suggest.call(this, inputRaw);
  }
}






/**
 * Provides a key-value persistent store solution for commands.
 * Commands can't access data from other commands and lose access to data if its filename changes.
 * A commands' data is scoped by its name space (defined by its filename).
 * Uses the stack trace to determine the command's filename.
 *
 * @param {string} key unique key identifier within the object store.
 * @param {string} val data value to store.
 *
 * @returns {Object} the value of the object stored in the `key` value (possibly undefined).
 * @returns {Object} the entire DB object (when niether `key` or `val` are provided).
 * @returns {boolean} `false` if attempting to overwrite an existing value, `true` when successfully stored.
 */
module.exports.storage = function (key, val) {
  const cmdId = getCallerFileName(3);

  const cmdDb = new JSONdb(`./.data/${cmdId}.json`, {
    syncOnWrite: false,
    jsonSpaces: 0,
  });

  // No arguments provided.
  if (!key && !val) {
    return cmdDb.JSON();
  }

  var retrievedValue = cmdDb.get(key);

  // Only @key provided, attempting to access existing entry.
  if (!val) {
    return retrievedValue;
  }

  // Attempting to save onto an existing entry.
  if (retrievedValue) {
    return false;
  }

  // Create a new entry in the db.
  cmdDb.set(key, val);
  cmdDb.sync();

  return true;
}






/**
 * Allows commands to read/set cookies.
 * Properly handles JSON objects, serialising/deserialising when appropriate.
 * A prefix is prepended to namepsace the cookie name: `rabbit2-{cmdId}-`,
 * using the stack trace to determine the command's filename.
 * Default TTL value is 1 year.
 */
module.exports.cookie = function (name, value, ttl = 31556952000) {
  const cmdId = getCallerFileName(3);

  const cookieName = `rabbit2-${cmdId}-${name}`

  // Set cookie, serialises if applicable
  if (name && value !== undefined) {
    let cookieValue = typeof value === "string"
      ? value
      : JSON.stringify(value)
    ;

    this.serverResponse.cookie(cookieName, cookieValue, {
      maxAge: ttl,
      httpOnly: true, // Disables accessing cookie via client side JS.
    });

    return;
  }

  // Get cookie, deserialising if possible
  var getCookieValue = this.serverRequest.cookies[cookieName];

  try {
    getCookieValue = JSON.parse(getCookieValue);
  } catch (e) { }

  return getCookieValue;
}






/**
 * Exposes a view renderer function to commands.
 * Determines the orgin command's filename via stack trace.
 * Injects additional data made available to the view.
 * The original <data> passed by the command is made available under a <data> property.
 */
module.exports.renderView = function (data) {
  const cmdId = getCallerFileName(3);

  var viewData = {
    data: data,

    // Expose additional data (e.g. used by /includes/header.ejs)
    cmdObj: {
      id: cmdId,
      name: this.cmdDirectory[cmdId].name,
      summary: this.cmdDirectory[cmdId].summary,
      description: this.cmdDirectory[cmdId].description,
    }
  };

  // Special to the `list` view, expose the run count data of commands.
  if (cmdId === 'list') {
    viewData.cmdRunCounts = rabbit2MemDb.commandRunCounts;
  }

  this.serverResponse.render(cmdId, viewData);
}






/**
 * Convenience function to escape regex characters in a <string>.
 *
 * https://www.npmjs.com/package/escape-string-regexp
 */
module.exports.escapeRegexString = function (string) {
  if (typeof string === 'string') {
    return string
      .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      .replace(/-/g, '\\x2d');
  } else {
    return '';
  }
}






/**
 * Convenience function to help validate if a <urlString> is a valid URL.
 * Returns a URL object or undefined otherwise.
 */
module.exports.urlise = function (urlString) {
  try {
    return new URL(urlString);
  } catch (e) { }
}






/**
 * Increments the run counter for <cmd>.
 * If no <cmd> is defined, increments a special "unmatched command" counter (key: '').
 */
function incrementRunCount(cmd = "") {
  var isDevEnvironment = this.serverRequest.get('Referrer') === 'https://glitch.com/';

  // Avoids incrementing the count with repeated refreshes that can occur during development.
  if (isDevEnvironment) {
    return;
  }

  var count = (rabbit2MemDb.commandRunCounts[cmd] || 0) + 1;

  rabbit2MemDb.commandRunCounts[cmd] = count;

  // Persist the latest db from memory to disk.
  rabbit2Db.JSON(rabbit2MemDb);
  rabbit2Db.sync();
}






/**
 * Returns the name of the file in commands/ that initiated the callstack.
 */
function getCallerFileName(stackDepth) {
  const callerPath = getCallerFile(stackDepth);

  return path.parse(callerPath).name.toLowerCase().split(".")[0];
}
