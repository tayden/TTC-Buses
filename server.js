var app = require('express')();
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
var restbus = require("restbus");

var data;

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('data', { data: data });
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Start server
var port = process.env.PORT || 8000;
server.listen(port, function () {
  console.log('App listening on port %s', port);

  restbus.listen(3535, function() {
    console.log('restbus is now listening on port 3535');

    streamBuses();

  });
});

function streamBuses(){
  http.get("http://localhost:3535/agencies/ttc/vehicles", function(res) {
    console.log("Got response: " + res.statusCode);
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function() {
      data = JSON.parse(body);
      // console.dir(data);
      // send data to clients
      io.emit('data', { data: data });
    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  setTimeout(streamBuses, 1000);
}
