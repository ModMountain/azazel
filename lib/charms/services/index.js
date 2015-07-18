module.exports = {
  initialize: function() {
    var services;
    try {
      services = require('require-all')(process.cwd() + "/api/services");
    } catch(e) {
        services = {};
    }
    Azazel.services = services;
    _.extend(global, services);

    return Promise.resolve();
  }
};
