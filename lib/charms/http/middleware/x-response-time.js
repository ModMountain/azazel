module.exports = function wrapper(app) {
  return xResponseTime;
  function* xResponseTime(next) {
    var start = Date.now();
    yield next;
    var ms = Date.now() - start;
    this.set("X-Response-Time", ms + "ms");
  }
};
