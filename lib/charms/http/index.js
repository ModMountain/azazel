var Path = require("path");
var Koa = require("koa");
var HTTP = require("http");

var app;
var httpServer;
module.exports = {
  app: app,
  httpServer: httpServer,

  initialize: function() {
    return new Promise(function(resolve, reject) {
      // Start building our Koa web application
      app = Koa();

      // Configure the app's secret keys
      app.keys = Azazel.config.http.keys;

      if (Azazel.config.http.errorHandler) require('koa-onerror')(app);

      // Load middleware and modifiers into the application
      loadMiddleware();
      loadModifiers();

      httpServer = HTTP.createServer(app.callback());
      httpServer.listen(Azazel.config.http.port, Azazel.config.http.bindAddress, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });

      module.exports.app = app;
      module.exports.httpServer = httpServer;
    });
  },
  shutdown: function() {
    httpServer.close();
    return Promise.resolve();
  }
};

function loadMiddleware() {
  // Default middleware provided by Azazel
  var defaultMiddleware = require('require-all')(Path.join(__dirname, "middleware"));

  // Middleware supplied by the user
  var suppliedMiddleware;
  try {
    suppliedMiddleware = require('require-all')(Path.join(process.cwd(), "api", "middleware"));
  } catch(e) {
    suppliedMiddleware = {};
  }

  // Default middleware and supplied middleware merged together, with supplied overriding default
  var mergedMiddleware = _.merge(suppliedMiddleware, defaultMiddleware);

  //TODO this can probably be cleaned up considerably
  Azazel.config.http.middleware.forEach(function(middlewareName) {
      // Ensure that the file returns a wrapper function
      var middlewareWrapper = mergedMiddleware[middlewareName];
      if (typeof middlewareWrapper === "function") {
          // Get the middleware
          var wrapperResult = middlewareWrapper(app);
          if (typeof wrapperResult === "function") {
            Azazel.log.verbose("Loading middleware '" + middlewareName + "'");
            app.use(wrapperResult);
          } else if (Array.isArray(wrapperResult)) {
            Azazel.log.verbose("Loading middleware '" + middlewareName + "'");
            wrapperResult.forEach(function(innerMiddleware) {
              app.use(innerMiddleware);
            });
          } else {
              Azazel.log.error("Unsupported middleware '" + middlewareName + "'");
          }
      } else {
          Azazel.log.error("Unsupported middleware '" + middlewareName + "'");
      }
  });
}

function loadModifiers() {
  // Default modifiers provided by Azazel
  var defaultModifiers = require('require-all')(Path.join(__dirname, "modifiers"));

  // Modifiers supplied by the user
  var suppliedModifiers;
  try {
    suppliedModifiers = require('require-all')(Path.join(process.cwd(), "api", "modifiers"));
  } catch(e) {
    suppliedModifiers = {};
  }

  // Default modifiers and supplied modifiers merged together, with supplied overriding default
  var mergedModifiers = _.merge(suppliedModifiers, defaultModifiers);

  //TODO this stuff is probably not safe, at all
  var modifierPool = {};
  _.keys(mergedModifiers).forEach(function (a) {
    var modifierFile = mergedModifiers[a];
    _.merge(modifierPool, modifierFile);
  });

  Azazel.config.http.modifiers.forEach(function(modifierName) {
      var modifier = modifierPool[modifierName];
      if (typeof modifier === "function") {
          Azazel.log.verbose("Loading modifier '" + modifierName + "'");
          app.context[modifierName] = modifier;
      } else {
          Azazel.log.error("Unsupported middleware '" + middlewareName + "'");
      }
  });
}
