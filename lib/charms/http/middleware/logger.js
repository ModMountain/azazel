module.exports = function wrapper(app) {
  return logger;
  function* logger(next) {
      var start = Date.now();
      yield next;
      var ms = Date.now() - start;
      console.log("%s %s - %s", this.method, this.url, ms);
  }
};
