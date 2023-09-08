
module.exports = {

  name: 'Bookmark',
  summary: 'Virtual URL bookmarks',
  description: 'Redirect shortcuts to virtual URL bookmarks.',
  usage: 'bk {shortcut}',
  authors: ['paulo.avila@'],

  operators: {
    list: 'List all existing bookmarks, filtered by your input.',
    new: 'Create a new URL shortcut.',
    // update: 'Update the URL of an existing shortcut (a version history is kept).',
    // folder: 'bk /level1/level2',
    // filter: '',
  },

  run: function (inputArg, inputOps, inputRaw) {
    const [inputLeft, inputRight] = inputArg.split(' ', 2);

    // Redirect.
    if (inputOps.length === 0) {
      if (inputLeft) {
        return getBookmarkUrl.call(this, inputLeft);
      } else {
        renderListView.call(this, inputLeft);
      }
      
      return;
    }

    // By here, there are operators.

    // List all.
    if (inputOps.includes('list')) {
      //this.renderView({ json: this.storage() });
      renderListView.call(this, inputLeft);

      return;
    }

    // For the remaining operators (`.new` or `.update`) we ensure there are two inputs.
    if (inputLeft && inputRight) {
      //if (inputOps.includes('del') && inputOps.includes('new')) {
      // if (inputOps.includes('update')) {
      //   updateBookmark.call(this, inputLeft, inputRight);
      // }

      if (inputOps.includes('new')) {
        createBookmark.call(this, inputLeft, inputRight);
      }
      return;
    }

    // No inputs.
    if (!inputLeft) {
      this.renderView({
        prompt: `Define a shortcut name`,
      });

      return;
    }

    // Only one input
    this.renderView(this.urlise(inputLeft)
      ? // Prompt for shortcut name.
      {
        prompt: `Define shortcut name for: ${inputLeft}`,
        val: inputLeft,
      }
      : // Prompt for url.
      {
        prompt: `Define URL for: ${inputLeft}`,
        key: inputLeft,
      }
    );

    return;
  },

  suggest: function (searchString) {
    const LIMIT = 25;
    const db = this.storage();

    var suggestions = [];

    const allEntries = Object.entries(db);
    for (let i = allEntries.length - 1; i >= 0; i--) {
      let [bkName, bkObj] = allEntries[i];

      if (bkName.indexOf(searchString) >=0) {
        let bkUrl = bkObj.urls[0];
        let bkOwner = bkObj.owner || '-';

        suggestions.push({
          text: `<match>${bkName}</match> <dim>(${bkOwner})</dim> <url>${bkUrl}</url>`,
          url: bkUrl,
        });
      }

      if (suggestions.length >= LIMIT) {
        break;
      }
    }

    return suggestions;
  },

};






/*


"folder": {
  "/": { ... }
  "/finance": { ... }
  "/people": { ... }
  "/core/experience/prds": { ... }
  "/core/paulo/documents": { ... }
}

"folder": {
  "name": "/",
  "shortcuts": { ... }

  "folder": {
    "name": "prod"
    "shortcuts": {
      "name": {
        urls: [],
        created: ""
      }
    }

  },
}

*/


/**
 * Sanitises the shortcut name.
 * Trims leading and trailing forward slashes ("/").
 * Strips any character except for:
 * - Dashes `-`
 * - Underscores `_`
 * - Alphanumeric `a-z`, `0-9`
 * - Forward slashes `/`
 * - Most emojis: https://www.unicode.org/Public/UCD/latest/ucd/emoji/emoji-data.txt
 */
function parseInputShortcut(inputShortcut) {
  var inputClean = inputShortcut
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^-/\w\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
  ;

  const inputFolders = inputClean.split('/');
  const inputName = inputFolders.pop();
  const inputPath = `${inputFolders.join('/')}`;

  return {
    name: inputName,
    path: inputPath,
    full: `${inputPath}/${inputName}`,
    // key: `${inputClean}`,
    // folders: inputFolders,
  };
}



function selectBookmarkObj(bkPath, bkName) {
  const bkFolderObj = this.storage(bkPath);
  const bkObj = bkFolderObj && bkFolderObj[bkName];

  return bkObj;
}

function upsertBookmarkObj(bkPath, bkName) {
  
    // this.storage(bkTokens.full, {
    //   urls: [urlObj.href],
    //   //owner: 'paulo.avila@',
    //   created: now,
    //   modified: now,
    // });

  const bkFolderObj = this.storage(bkPath);
  const bkObj = bkFolderObj && bkFolderObj[bkName];

  return bkObj;
}





function getBookmarkUrl(inputShortcut) {
  const bkTokens = parseInputShortcut(inputShortcut);
  const bkObj = selectBookmarkObj(bkTokens.path, bkTokens.name);
  
  //return bkObj || {};

  if (!bkObj) {
    this.renderView({
      alert: `Doesn't exist: ${bkTokens.full}`,
      //html: `<p>...</p><p>${inputName} → <a href="${bkObj.urls[0]}">${bkObj.urls[0]}</a></p><p>...</p>`,
    });

    return false;
  }

  return bkObj.urls[0];
}



function createBookmark(inputShortcut, inputUrl) {
  const bkTokens = parseInputShortcut(inputShortcut);

  const urlObj = this.urlise(inputUrl);

  if (!urlObj) {
    this.renderView({
      alert: `Invalid URL: ${inputUrl}`,
      prompt: `Define URL for: ${bkTokens.full}`,
      key: bkTokens.full,
    });

    return false;
  }

  const bkObj = selectBookmarkObj(bkTokens.path, bkTokens.name);

  if (bkObj) {
    this.renderView({
      alert: `Already exists: ${bkTokens.full}`,
      html: `<p>...</p><p>${bkTokens.full} → <a href="${bkObj.urls[0]}">${bkObj.urls[0]}</a></p><p>...</p>`,
    });

    //updateBookmark();
    return false;
  } else {
    let now = new Date();

    this.storage(bkTokens.full, {
      urls: [urlObj.href],
      //owner: 'paulo.avila@',
      created: now,
      modified: now,
    });

    renderListView.call(this);

    return true;
  }
}




function updateBookmark(inputShortcut, inputUrl) {
  const inputName = sanitiseShortcutName(inputShortcut);
  const urlObj = this.urlise(inputUrl);

  if (!urlObj) {
    this.renderView({
      alert: `Invalid URL: ${inputUrl}`,
      prompt: `Define URL for: ${inputName}`,
      key: inputName,
    });
    
    return false;
  }

  const bkObj = this.storage(inputName);

  if (!bkObj) {
    return createBookmark.call(this, inputShortcut, inputUrl);
  }

  const userId = "paulo.avila@";

  // Unauthorised.
  if (bkObj.owner && bkObj.owner !== userId) {
    this.renderView({
      alert: `${bkObj.owner} created ${inputName} and you don't have permission to update it 😗`,
      //html: `<p>...</p><p>${inputName} → <a href="${bkObj.urls[0]}">${bkObj.urls[0]}</a></p><p>...</p>`,
    });

    return false;
  }

  this.storage(inputName, {
    urls: [
      urlObj.href,
      ...bkObj.urls,
    ],
    owner: userId,
    modified: (new Date()),
  });

  renderListView.call(this);

  return true;
}




function renderListView(inputShortcut, orderByField) {
  //const filterString = sanitiseShortcutName(inputShortcut);

  // order by modified
  
  let bkEntries = Object.entries(this.storage())
    .slice(-500) // limit to the most recent additions
    .reverse()
  ;

  this.renderView({
    list: bkEntries.map(bkEntry => {
      let [bkName, bkObj] = bkEntry;

      return {
        bkName: bkName,
        bkUrl: bkObj.urls[0],
        bkUrlVersion: `v${bkObj.urls.length}`,
        bkOwner: bkObj.owner || '--',
        bkModified: bkObj.modified || bkObj.created,
      }
    }),
  });
}

