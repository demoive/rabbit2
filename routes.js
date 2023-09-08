const rabbit2 = require('./rabbit2');


/**
 * Root of the server.
 * Invoke commands specified by a query string and attempts to handle its return value.
 * If no query string, shows a list of available commands.
 */
module.exports.triageRun = async function (req, res) {
  var intentParams = parseRequestIntent(req);

  // Expose server objects for access in rabbit2.
  rabbit2.serverRequest = req;
  rabbit2.serverResponse = res;

  if (intentParams.cmdStr === '') {
    // res.sendFile(__dirname + '/README.md');
    // return;

    // We invoke the command's run() directly (avoids incrementing the run counter).
    rabbit2.cmdDirectory['list'].run.call(rabbit2);

    return;
  }

  const commandRunReturn = await rabbit2.execRun(intentParams);

//   // Case 1: Command returns an object.
//   // Render a `/views` by the same name as command, passing it the returned provided data object.
//   if (typeof commandRunReturn === "object") {
//     // If render error, send return value as plain text?
//     // ejs.renderFile(filename, data, options, (err, str) => {});
//     // res.render(intentParams.cmdStr, {
//     //   data: commandRunReturn
//     // })

//     return;
//   }

  // Case 2: Command returns a valid URL string.
  // Redirect to the URL, with custom header options.
  let redirectUrlObj = rabbit2.urlise(commandRunReturn);
  if (redirectUrlObj) {
    //console.info(`URL redirect => ${redirectUrlObj.href}`);

    res
      .set('x-rabbit2-cmd', encodeURIComponent(intentParams.cmdStr))
      .set('x-rabbit2-ops', encodeURIComponent(intentParams.opsArr))
      .set('x-rabbit2-arg', encodeURIComponent(intentParams.argStr))
      .redirect(redirectUrlObj.href)
    ;

    return;
  }

  if (typeof commandRunReturn === "string") {
    // Case 3: Any other return type is rendered as plain text to the browser.
    res
      .type("text")
      .send(commandRunReturn)
    ;
  }

  // By here, we (assume) a server response has sent from elsewhere.
  //res.end();
}


/**
 * 
 */
module.exports.triageSuggest = async function (req, res) {
  const intentParams = parseRequestIntent(req);
  const commandId = intentParams.cmdStr;

  const cmdObj = rabbit2.cmdDirectory[commandId];

  if (!cmdObj || !cmdObj.suggest) {
    res.status(405).end();

    return;
  }

  var suggestions = await rabbit2.execSuggest(intentParams);

  // https://web.dev/cross-origin-resource-sharing/
  res.set('Access-Control-Allow-Origin', '*');
  res.json(suggestions);

  return;
}


/**
 * Returns the command directory as a JSON.
 */
module.exports.commandDirectoryJson = function (req, res) {
  res.json(rabbit2.cmdDirectory);
}


/**
 * Parses relevant inputTokens from the http request object.
 * Sometimes query strings arrive with pluses for spaces.
 * This ensures all pluses are encoded correctly so that the decode functions works as expected.
 */
//function inputTokensFromReq
function parseRequestIntent(req) {
  const DELIMETER_INPUT = ' ';
  const DELIMETER_OPERATOR = '.';

  var urlObj;
  var urlString = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  try {
    urlObj = new URL(urlString);
  } catch (e) {}

  var queryString = urlObj.search.substring(1);
  queryString = queryString.replace(/\+/g, '%20'); // Sometimes query strings arrive with pluses for spaces.
  queryString = decodeURIComponent(queryString);

  var inputTokens = {
    cmdStr: req.params.cmdId && req.params.cmdId.toLowerCase(),
    //opsArr: req.params.cmdOp && req.params.cmdOp.toLowerCase().split(DELIMETER_OPERATOR),
    rawStr: queryString
  };

  // If command run() (i.e. not suggest()), some more processing is needed
  // extract additional tokens from the input string.
  if (urlObj.pathname === '/') {
    let inputSplitIndex = queryString.indexOf(DELIMETER_INPUT);

    if (inputSplitIndex < 1) {
      inputSplitIndex = queryString.length;
    }

    const inputStringRight = queryString.slice(inputSplitIndex + 1);
    const inputStringLeft = queryString.slice(0, inputSplitIndex);

    let [
      command,
      ...operators
    ] = inputStringLeft.toLowerCase().split(DELIMETER_OPERATOR);
    // let operators = inputStringLeft.toLowerCase().split(DELIMETER_OPERATOR);
    // let command = operators.shift();

    inputTokens.cmdStr = command;
    inputTokens.opsArr = operators;
    inputTokens.argStr = inputStringRight;
  }

  return inputTokens;
}
