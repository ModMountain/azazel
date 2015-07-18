module.exports = function wrapper() {
  return favicon;
  function* favicon(next) {
    if (this.request.url === "/favicon.ico") {
      this.body = "Favicon";
    } else {
      yield next;
    }
  }
};
