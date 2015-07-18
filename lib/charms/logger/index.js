module.exports = {
  initialize: function() {
    var Winston = require('winston');
    var logger = new (Winston.Logger)({
      transports: [
        new (Winston.transports.Console)()
      ]
    });

    Azazel.log = logger;
    return Promise.resolve();
  }
};
