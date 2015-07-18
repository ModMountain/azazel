var Swig = require('swig');
module.exports = {
  cache: false,
  loader: Swig.loaders.fs(process.cwd() + '/views'),
  ext: "swig.html"
};
