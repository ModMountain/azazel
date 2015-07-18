module.exports = {
    port: 1337,
    errorHandler: true,
    keys: ["super secret key"],
    // Middleware in the order they are to be run
    middleware: [
        "favicon",
        "x-response-time",
        "logger",
        "static",
        "session",
        "flash",
        "csrf",
        "router",
    ],
    // Modifiers, order does not matter
    modifiers: [
      'view'
    ],
    static: {
      path: '.tmp/assets',
      maxage: 0
    }
};
