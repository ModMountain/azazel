var Path = require('path');

module.exports = function wrapper(app) {
  var loc = Path.join(process.cwd() + "/" + Azazel.config.http.static.path);
  Azazel.log.verbose("Serving static assets from", loc);

  var middleware = require('koa-file-server')({
    root: loc,
    maxage: Azazel.config.http.static.maxage
  });
  middleware._name = "static";
  return middleware;
};
