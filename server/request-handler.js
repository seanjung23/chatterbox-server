/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

var allMessages = [];
var idCount = 0;

var requestHandler = function(request, response) {
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
  // console.log('request object is;', request);
  const {headers, method, url} = request;
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/HTML';
  // console.log('raw headers', rawHeaders);
  console.log('Serving request type ' + method + ' for url ' + url);


  var route = url;

  if (method === 'GET' && route === '/classes/messages') {
    response.writeHead(200, defaultCorsHeaders);
    response.end(JSON.stringify(allMessages));
  } else if (method === 'POST' && route === '/classes/messages') {
    var incomingData = '';
    var parsedData;
    request.on('data', (chunk) => {
      incomingData += chunk;
    }).on('end', () => {
      parsedData = JSON.parse(incomingData);
      parsedData.messageID = idCount;
      idCount++;
      allMessages.push(parsedData);
      response.writeHead(201, defaultCorsHeaders);
      response.end(JSON.stringify(parsedData));
    });
    // request.end(JSON.parse(incomingData))
    // equivalent of lines 66-68 (prev 3 lines)

    // console.log('When am I hitting?');

  } else if (method === 'OPTIONS' && route === '/classes/messages') {
    response.writeHead(200, defaultCorsHeaders);
    response.end();
  } else {
    response.writeHead(404, defaultCorsHeaders);
    response.end();
  }

  // response.on('error', (err) => {
  //   console.error(err.stack);
  // });
  // console.log('this is body:', body);

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;


  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.statusCode = statusCode;
  // response.writeHead(statusCode, headers);


  // response.write(JSON.stringify(responseBody));
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.write('<html><body><h1>Hello, World!</h1></body></body></html>');
  // response.end('Soup');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports = requestHandler;