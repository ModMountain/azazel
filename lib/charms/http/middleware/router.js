var router = require("koa-router")();

// Build routes
for (var route in Azazel.config.routes) {
    var pieces = route.split(" ");
    var verb = pieces[0].toLowerCase();
    var url = pieces[1];
    var action;

    if (verb === "redirect") {
      action = Azazel.config.routes[route];
    } else {
      var actionPieces = Azazel.config.routes[route].split(".");
      var controller = actionPieces[0];
      action = Azazel.api.controllers[controller][actionPieces[1]];

      for (var i = 2; i < actionPieces.length; i++) {
          action = action[actionPieces[i]];
      }
    }
    Azazel.log.verbose("Binding route '" + url + "' to " + actionPieces);
    router[verb](url, action);
}
Azazel.router = router;

module.exports = function wrapper(app) {
  var middleware = router.routes();
  Azazel.charms.http.router = middleware.router;
  return [middleware, router.allowedMethods()];
};
