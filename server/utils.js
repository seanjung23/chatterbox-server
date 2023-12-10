// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10, // Seconds.
};

var send404 = function (response) {
  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.end('Not Found');
};

var sendResponse = function (response, payload, headers = {}, status = 200) {
  if (typeof payload === 'object' && payload !== null) {
    Object.assign(headers, { 'Content-type': 'application/json' });
    payload = JSON.stringify(payload);
  }

  response.writeHead(status, headers);
  response.end(payload);
};

var collectData = function (request, callback) {
  data = '';

  request.on('data', function (chunk) {
    data += chunk.toString();
  });
  request.on('end', function () {
    var message = JSON.parse(data);

    callback(message);
  });
};

module.exports = { defaultCorsHeaders, send404, sendResponse, collectData };
