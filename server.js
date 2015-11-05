var express = require("express");
var app = express();
var restbus = require("restbus");
var http = require("http");
var socket = require("socket.io");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});



// Start server
var port = process.env.PORT || 8000;
var server = app.listen(port, function () {
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
      var data = JSON.parse(body);
      console.dir(data);
      // SEND DATA TO CLIENTS HERE
      
    })

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });

  setTimeout(streamBuses, 20*1000);
}
