console.log("Starting up Azazel...");

var _ = require("lodash");
var koa = require("koa");
var app = koa();
var http = require("http");
var Azazel;

// Globalize everything
configureGlobals();

// Load middleware
console.log("Loading middleware...");
Azazel.config.http.stack.forEach(function(middlewareName) {
    var middleware = Azazel.api.middleware[middlewareName];
    if (typeof middleware === "function") {
        app.use(middleware);
    } else if (Array.isArray(middleware)) {
        middleware.forEach(function(innerMiddleware) { app.use(innerMiddleware); });
    } else {
        console.log("Unsupported middleware '" + middlewareName + "'");
    }
});

// Cleanup on exit properly
process.on("exit", function() {
  app.close();
});

// Bind the application
console.log("Startup complete, binding to port", Azazel.config.http.port);
http.createServer(app.callback()).listen(Azazel.config.http.port, Azazel.config.http.bindAddress, function(err) {
  if (err) {
    console.error("kek");
  }
});

function configureGlobals() {
    Azazel = {
        api: {
            controllers: undefined,
            middleware: undefined,
            models: undefined,
            services: undefined
        },
        config: {}
    };
    global.Azazel = Azazel;

    // Load the configuration, which everything else depends on
    Azazel.config = require("require-all")(__dirname + "/config");

    // First load the API
    Azazel.api.controllers = require("require-all")(__dirname + "/api/controllers");
    Azazel.api.middleware = require("require-all")(__dirname + "/api/middleware");
}
