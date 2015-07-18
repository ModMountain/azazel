module.exports = function wrapper(app) {
  var session = require("koa-session")(app);
  session._name = "session";
  return session;
};
