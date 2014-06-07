// server.js

// set up ======================================================================
var express  = require('express')
  , app      = express()
  , port     = process.env.PORT || 8002
  , mongoose = require('mongoose')
  , passport = require('passport')
  , flash    = require('connect-flash')
  , path     = require('path')
  , favicon  = require('static-favicon')
  , morgan       = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser   = require('body-parser')
  , session      = require('express-session')

  , bodyParser = require('body-parser')
  , crypto     = require('crypto')
  , server     = require('http').createServer(app)
  , io         = require('socket.io').listen(server)

  ;

// configuration ===============================================================
mongoose.connect('mongodb://localhost:27017/passport-example', function(err, res) {
  if(err) throw err;
  console.log('Conectado con éxito a la BD');
});

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(favicon());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser());
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded());

app.set('view engine', 'jade'); // set up jade for templating
app.use(require('stylus').middleware(path.join(__dirname, 'public'))); // set stylus middleware
app.use(express.static(path.join(__dirname, 'public'))); // set static dir to serve


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// sockets

io.sockets.on('connection', function(socket) {
  socket.on('send:message', function(user, msgData) {
    socket.broadcast.emit('posted:message', user, msgData);
  });
});

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
