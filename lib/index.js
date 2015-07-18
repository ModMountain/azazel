var Promise = require('bluebird');
var _ = require('lodash');
var FS = require('fs-extra');
var Path = require('path');
var Chains = require('bluebird-chains');

module.exports = {
  summon: function() {
    console.log("Summoning Azazel...");

    global.Azazel = {};

    setupGlobals();
    loadConfig();
    loadApi();
    loadCharms()
    .finally(function() {
      Azazel.log.info("Azazel has been summoned!");
    });
  },
  dismiss: function() {

  }
};

function setupGlobals() {
  global.Promise = Promise;
  global._ = _;
}

function loadConfig() {
  // The default configuration, supplied by Azazel
  var defaultConfig = require('require-all')(__dirname + "/config");

  // The user supplied configuration files
  var suppliedConfig;
  try {
    suppliedConfig = require('require-all')(process.cwd() + "/config");
  } catch (e) {
    console.error("No supplied configuration found:", e);
    suppliedConfig = {};
  }

  // Attach the merged configuration to the global namespace
  Azazel.config = _.merge(defaultConfig, suppliedConfig);
}

function loadApi() {
  Azazel.api = {
    controllers: {},
    middleware: {}
  };

  try {
    Azazel.api.controllers = require("require-all")(Path.join(process.cwd(), "/api/controllers"));
    Azazel.api.middleware = require("require-all")(Path.join(process.cwd(), "/api/middleware"));
  } catch (e) {}
}

function loadCharms() {
  // Setup the global namespace
  Azazel.charms = {};

  // Default charms, these are the ones provided by Azazel
  var defaultCharms = {};
  _.map(FS.readdirSync(Path.join(__dirname, "charms")), function(dir) {
    defaultCharms[dir] = require(Path.join(__dirname, "charms", dir));
  });

  // Supplied charms, these are provided by the user
  var suppliedCharms = {};
  try {
    FS.readdirSync(Path.join(process.cwd(), "charms")).forEach(function(dir) {
      suppliedCharms[dir] = require(Path.join(process.cwd(), "charms", dir));
    });
  } catch (e) {}


  // Merge the two sets together, allowing the supplied charms to override the defaults
  var mergedCharms = _.merge(defaultCharms, suppliedCharms);

  // From the merged sets, pick out what charms should be loaded according to the configuration
  var chains = new Chains();
  for (var key in Azazel.config.charms) {
      if (Azazel.config.charms[key] === true) {
        console.log("Loading charm '" + key + "'");
        // Attach the charm to the global namespace
        Azazel.charms[key] = mergedCharms[key];
        // Make sure the charm will initialize
        chains.push(Azazel.charms[key].initialize);
      }
  }

  // Initialize the charms
  return chains.run();
}
