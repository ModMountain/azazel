var Path = require('path');
var Swig = require('swig');
var swig = new Swig.Swig(Azazel.config.views);
Promise.promisifyAll(swig);

module.exports.view = function* (view, locals) {
  if (locals === undefined) locals = {};
  _.merge(locals, this.state);

  var html = yield swig.renderFileAsync(Path.join(process.cwd(), "views", view + "." + Azazel.config.views.ext), locals); //TODO the template path needs to not be hardcoded
  this.body = html;
  this.set('Content-Type', 'text/html');
  return html;
};
