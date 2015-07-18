var io;
module.exports = {
  initialize: function() {
    io = require('socket.io')(Azazel.charms.http.httpServer);

    var methods = ['get', 'post', 'put', 'delete'];

    io.on('connection', function(socket) {
      for (var m of methods) {
        socket.on(m, function(packet) {
          var method = packet.method;
          var data = packet.data;
          var headers = packet.headers;
          var url = packet.url;

          // Iterate over every route in the router stack
          // If the route does not support the method we're using, skip it
          // Otherwise try and match it, if it doesn't match skip it
          for (var route of Azazel.charms.http.router.stack) {
            for (var routeMethod of route.methods) {
              if (routeMethod.toLowerCase() === method) {
                if (url.match(route.regexp) !== null) {
                  //TODO "ctx" needs to be modified so it emulates a Koa request / response context
                  var ctx = {
                    request: {
                      method: method,
                      url: url,
                      headers: headers,
                      isSocket: true,
                      socket: socket
                    },
                    response: {

                    },
                    originalUrl: url
                  };
                  return route.middleware.call(ctx).next();
                }
              }
            }
          }
        });
      }
    });

    return Promise.resolve();
  }
};
