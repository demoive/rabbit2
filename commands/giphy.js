
module.exports = {

  name: 'Giphy',
  summary: 'Find a gif',
  description: 'Searches Giphy.com for gifs 👾!',
  usage: 'giphy {search}',
  authors: ['paulo.avila@'],

  run: async function (inputArg) {
    var searchTerms = encodeURIComponent(inputArg.split(/\s+/).join('-'));
    // https://developers.giphy.com/docs/#translate-endpoint

    //var results = await fetchWutResults(inputArg);
    //console.log(results);

    return `https://giphy.com/search/${searchTerms}`;
  },

};








const fetch = require('node-fetch');


function fetchWutResults(searchString) {
  var fetchUrl = new URL('https://api.giphy.com/v1/gifs/translate');

  fetchUrl.searchParams.set('api_key', process.env.PAULO_GIPHY_SDK_KEY);
  fetchUrl.searchParams.set('s', searchString);
  
  var queryResults = fetch(fetchUrl.href, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => data);
  
  return queryResults;
}



