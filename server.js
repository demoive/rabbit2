const express = require('express');
const routes = require('./routes');

const app = express();

// Allow rendering of files with the pug template engine. 
app.set('view engine', 'pug');

// Support serving static files from the `/public/` directory.
//app.use(express.static('public'));

// Register the routes.
//routes(app);
//app.route('/').get(routes.commandTriage);
app.get('/',              routes.commandTriage);
app.get('/commands.json', routes.commandDirectoryJson);

// Begin listening for HTTP requests.
const server = app.listen(process.env.PORT, () => {
  console.log('Server listening on port %s', server.address().port);
});
