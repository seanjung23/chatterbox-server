/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var urlParser = require('url');
var {
  defaultCorsHeaders,
  send404,
  sendResponse,
  collectData,
} = require('./utils.js');

var messages = [];

var requestHandler = function (request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + url);

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  var url = urlParser.parse(request.url).pathname;

  if (url === '/classes/messages') {
    if (request.method === 'GET') {
      sendResponse(response, { results: messages });
    } else if (request.method === 'POST') {
      collectData(request, function (message) {
        message.objectId = messages.length;
        messages.push(message);

        sendResponse(response, message, {}, 201);
      });
    } else if (request.method === 'OPTIONS') {
      sendResponse(response, undefined, defaultCorsHeaders);
    } else {
      send404(response);
    }
  } else {
    send404(response);
  }
};

module.exports = { requestHandler };
