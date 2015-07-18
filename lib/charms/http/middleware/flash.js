module.exports = function wrapper(app) {
  var flashMiddleware = require("koa-connect-flash")();
  flashMiddleware._name = "flash";
  return flashMiddleware;
};
