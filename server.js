const functions = require('firebase-functions');

const express = require('express');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();

// Allow usage of cookies.
app.use(cookieParser());

// Allow rendering of files with the pug template engine. 
app.set('views', './views');
app.set('view engine', 'pug');
//app.set('view engine', 'ejs');

// Support serving static files from the `/public/` directory.
//app.use(express.static('./public'));

// Register the routes.
//routes(app);
//app.route('/').get(routes.commandTriage);
app.get('/',              routes.commandTriage);
app.get('/commands.json', routes.commandDirectoryJson);

// Begin listening for HTTP requests.
const server = app.listen(process.env.PORT, () => {
  console.log('Server listening on port %s', server.address().port);
});

exports.app = functions.https.onRequest(app);
