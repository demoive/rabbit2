
module.exports = {

  name: '¿Que?',
  summary: 'Internal dictionary/glossary',
  description: 'Searches our internal dictionary. With no parameters, redirects to the full database.',
  usage: 'que [{search}]',
  authors: ['paulo.avila@'],

  run: async function (inputArg) {
    if (!inputArg) {
      return `${process.env.NOTION_BASE_URL}/${process.env.NOTION_DB_ID_WUT}`;
    }

    var searchResultsRaw = await fetchWutResults(inputArg);
    var searchResultsClean = cleanSearchResults(searchResultsRaw);

    this.renderView({ searchResultsClean });
  },

  suggest: async function (searchString) {
    var searchResultsRaw = await fetchWutResults(searchString);
    var searchResultsClean = cleanSearchResults(searchResultsRaw);

    var suggestions = searchResultsClean.map(result => {
      return {
        text: Object.values(result.entryCol).join(' '),
        url: result.entryUrl
      };
    });

    return suggestions;
  },

};





const fetch = require('node-fetch');

var dbProperties = {
  "Acronym": "match",
  "Term": "",
  "Description": "dim",
};


/**
 * Returns an Array of Objects with data of each entry from
 * the query results (url and values of each column in plain text):
 *
 * [
 *   {
 *     entryCol: {
 *       Acronym: ""
 *       Term: ""
 *       Description: ""
 *     }
 *     entryUrl: ""
 *   }
 * ]
 */
function cleanSearchResults(queryResults) {
  var processedResults = queryResults.map(result => {
    var resultObj = {
      entryCol: {},
      entryUrl: `${process.env.NOTION_BASE_URL}/${process.env.NOTION_DB_ID_WUT}?p=${result.id.replace(/-/gi,'')}`
    };

    for (let [prop, tagName] of Object.entries(dbProperties)) {
      let propertyText = '';
      let propertyContents = result.properties[prop].title || result.properties[prop].rich_text || [];

      // Concatenate all possible plain_text bits of rich_text results.
      propertyContents.forEach(richTextToken => {
        propertyText = `${propertyText}${richTextToken.plain_text}`;
      });

      if (tagName) {
        propertyText = `<${tagName}>${propertyText}</${tagName}>`;
      }

      resultObj.entryCol[prop] = propertyText;
    }

    return resultObj;
  });
  
  return processedResults;
}





async function fetchWutResults(searchString) {
  const fetchUrl = `https://api.notion.com/v1/databases/${process.env.NOTION_DB_ID_WUT}/query`;

  var queryOrs = Object.keys(dbProperties).map(prop => {
    return {
      property: prop,
      rich_text: { contains: searchString }
    }
  });

  var queryResults = fetch(fetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28'
    },
    body: JSON.stringify({
      //page_size: 25,
      filter: {
        or: queryOrs
      },
      sorts: [
        {
          "timestamp": "created_time",
          "direction": "descending"
        }
      ]
    })
  })
  .then(response => response.json())
  .then(data => data.results);
  
  return queryResults;
}
