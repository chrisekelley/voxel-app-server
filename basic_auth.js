// Example configuration for basic-auth
// The [basicAuth](https://github.com/chrisekelley/voxel-server/commit/79480a21951f428ca93d117f2344d65a2d69c64a) 
// commit has an example of how to use express with the basicAuth middleware.

// Make sure that you require express and browserify_express:

var express = require('express')
var browserify_express = require('browserify-express')

// Here is the basicAuth code:

  var game = engine(settings)
  var app = express();
  // Authenticator
  app.use(express.basicAuth(function(user, pass) {
    return true;
  }));
  app.use(express.static(__dirname + '/www'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  app.get('/home', function(req, res) {
    res.send('Hello World');
  });

  var bundle = browserify_express({
    entry: __dirname + '/www/js/demo.js',
    watch: __dirname + '/www/js/',
    mount: '/js/bundle.js',
    verbose: true,
    minify: false,
    bundle_opts: { debug: true }, // enable inline sourcemap on js files
    watch_opts: { recursive: false} // disable recursive file watch
  });

  app.use(bundle);

  var server = http.createServer(app);
  server.listen(8080);
  var wss = new WebSocketServer({server: server});
  console.log("Web server has started.\nPlease log on http://127.0.0.1:8080/index.html");