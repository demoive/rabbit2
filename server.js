const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();

// Allow usage of cookies.
app.use(cookieParser());

// Allow serving static files from the `/public/` directory.
app.use(express.static('./public'));
//console.log(process.env.PROJECT_DOMAIN);

// Allow rendering of files with a template engine. 
app.set('views', './views');
app.set('view engine', 'ejs');

// Register the routes.
//routes(app);
app.route('/').get(routes.triageRun); // '/r/:command.(:operators?)/?:input?'
app.route('/s/:cmdId/').get(routes.triageSuggest);
app.route('/commands.json').get(routes.commandDirectoryJson);

// Begin listening for HTTP requests.
const server = app.listen(process.env.PORT, () => {
  console.log('Server listening on port %s', server.address().port);
});
