var five = require("johnny-five"),
  board, button;

board = new five.Board();

var prevHold = false;
var send = false;

board.on("ready", function () {

  // Create a new `button` hardware instance.
  // This example allows the button module to
  // create a completely default instance
  button = new five.Button(2);

  // Inject the `button` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    button: button
  });

  // Button Event API

  // "down" the button is pressed
  button.on("down", function () {
    //console.log("down");
  });

  // "hold" the button is pressed for specified time.
  //        defaults to 500ms (1/2 second)
  //        set
  button.on("hold", function () {
    //console.log("hold");
    if (!prevHold) {
      console.log("activated");
    }
    prevHold = true;
  });

  // "up" the button is released
  button.on("up", function () {
    //console.log("up");
    if (prevHold && !send) {
      send = true;
      console.log("SEND");

      var https = require('https');

      var url = "https://batmobile-damaged-stage.sa-hackathon-01.cluster.extend.sap.cx";

      var options = {
        host: "batmobile-damaged-stage.sa-hackathon-01.cluster.extend.sap.cx",
        port: 443,
        path: "/",
        method: 'GET'
      };

      var req = https.request(options, function (res) {
        console.log(res.statusCode);
        res.on('data', function (d) {
          process.stdout.write(d);
        });
      });
      req.end();

      req.on('error', function (e) {
        console.error(e);
      });

      var request = require("request");

      request(url, function (error, response, body) {
        console.log(body);
      });
    }
  });
});
