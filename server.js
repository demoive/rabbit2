
const express = require('express');

const app = express();

// Allow rendering of files with the pug template engine. 
app.set('view engine', 'pug');

// Support serving static files from the `/public/` directory.
app.use(express.static('public'));

// Register the routes.
const routes = require('./routes.js');
routes(app);

// Begin listening for HTTP requests.
const server = app.listen(process.env.PORT, () => {
  console.log('Server listening on port %s', server.address().port);
});
