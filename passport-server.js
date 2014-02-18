/*
passport server
*/

// var passport = require('passport')
//   , LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function(err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));




/*
  gzip-middleware.js: Basic example of `connect-gzip` middleware in node-http-proxy

  Copyright (c) Nodejitsu 2013

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/

var http 					= require('http'),
  express 				= require('express'),
  winston 				= require('winston'), // for transports.Console	
	expressWinston 	= require('express-winston'),
	passport 				= require('passport'),
	PersonaStrategy = require('passport-persona').Strategy;

var app = express();


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the BrowserID verified email address
//   is serialized and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user.email);
});

passport.deserializeUser(function (email, done) {
  done(null, { email: email });
});


// Use the PersonaStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a BrowserID verified email address), and invoke
//   a callback with a user object.
passport.use(new PersonaStrategy({
    audience: 'http://127.0.0.1:3000'
  },
  function(email, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's email address is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the email address with a user record in your database, and
      // return that user instead.
      return done(null, { email: email })
    });
  }
));

// configure Express
app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());

	// express-winston logger makes sense BEFORE the router.
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ]
  }));

  app.use(app.router);

 // express-winston errorLogger makes sense AFTER the router.
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true
      })
    ]
  }));
});

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
  console.log("Starting in development mode");
});


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
}; 

// app.use(function (req, res, next) {
//   var format = req.param('format');

//   if (format) {
//     req.headers.accept = 'application/' + format;
//   }

//   next();
// });



app.get('/', function (req, res, next) {

	res.format({
	  text: function(){
	    res.send(req.user);
	  },

	  html: function(){
	    res.send('<div>'+req.user+'</div>');
	  },

	  json: function(){
	    res.send({ user: req.user });
	  }
	});
  next();

});


    app.get('/error', function(req, res, next) {
      // here we cause an error in the pipeline so we see express-winston in action.
      return next(new Error("This is an error and it should be logged to the console"));
    });


// POST /auth/browserid
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  BrowserID authentication will verify the assertion obtained from
//   the browser via the JavaScript API.
app.post('/auth/browserid', 
  passport.authenticate('persona', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


// app.get("/offline.manifest", function(req, res){
//   res.header("Content-Type", "text/cache-manifest");
//   res.end("CACHE MANIFEST");
// });

http.createServer(app).listen(3000);

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}