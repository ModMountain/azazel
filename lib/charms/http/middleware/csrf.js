module.exports = function wrapper(app) {
  var csrf = require('koa-csrf');
  csrf(app);

  csrf.middleware._name = "csrf";
  return [csrf.middleware, csrfChecker];

  function* csrfChecker(next) {
    if (this.method === "GET" || this.method === "HEAD") {
      // this.body = this.csrf;
    } else if (this.method === "POST") {
      //TODO parse the CSRF out of the POST body
    }

    yield next;
  }
};
