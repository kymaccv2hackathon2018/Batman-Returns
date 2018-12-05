/*
Dependencies:
{
    "dependencies": {
    "request": "^2.85.0",
    "apn": "^2.2.0"
  }
}

Service Bindings:
ec-occ-commerce-webservices-v2-ec692-overdue-cancel

Environment Variable:
USER_ENVIRONMENT = stage
*/

const apn = require('apn');

const request = require('request');
const traceHeaders = ['x-request-id', 'x-b3-traceid', 'x-b3-spanid', 'x-b3-parentspanid', 'x-b3-sampled', 'x-b3-Flags', 'x-ot-span-context']

const BATMAN_DEVICE_TOKEN = "<DEVICE TOKEN>";

// AuthKey_2LGBY37RFB.p8
var key = new Buffer("-----BEGIN PRIVATE KEY-----\n" +
  "\n" +  // TODO
  "\n" +  // TODO
  "\n" +  // TODO
  "\n" +  // TODO
  "-----END PRIVATE KEY-----")

let provider = new apn.Provider({
  token: {
    key: key,
    keyId: "2LGBY37RFB",
    teamId: "94JNSTR4TD"
  },
  production: false
});

function sendNotification(data) {

  let deviceTokens = [data.deviceToken];

  let notification = new apn.Notification();
  notification.alert = data.alert;
  notification.badge = data.badge;
  notification.sound = "default";
  notification.topic = "com.sap.cx.labs.hackathon.batman-notification";
  notification.payload = data;

  provider.send(notification, deviceTokens).then((response) => {
    console.log("SEND");
    provider.shutdown();
  });
}

function orderCreotedEvent(event, context) {
  console.log("In Lambda with event.data.orderCode: " + event.data.orderCode);
  var orderId = event.data.orderCode;
  // batstore.cqz1m-softwarea1-d1-public.model-t.cc.commerce.ondemand.com
  var url = `${process.env.GATEWAY_URL}/batstore/orders/${orderId}`;
  var userEnvironment = `${process.env.USER_ENVIRONMENT}`;
  if (userEnvironment === undefined) {
    console.log('Environment variable USER_ENVIRONMENT is not defined')
  }
  console.log("In Lambda with userEnvironment: " + userEnvironment)
  console.log("In Lambda with url: " + url)

  // Pass the headers through to the next calls, so that tracing will work
  var traceCtxHeaders = extractTraceHeaders(event.extensions.request.headers)
  console.log("traceCtxHeaders >>>", traceCtxHeaders);
  request.get({ headers: traceCtxHeaders, url: url, json: true }, function (error, response, body) {
    if (error === null) {
      console.log("In Lambda with response.statusCode: " + response.statusCode)
      if (response.statusCode == '200') {

        var order = {
          orderId: orderId,
          userName: body.user.name,
          total: body.totalPriceWithTax.value,
          address: body.deliveryAddress.line1,
          postalCode: "" + body.deliveryAddress.postalCode + "",
          town: body.deliveryAddress.town
        }

        console.log("ORDER", order);

        if (body.totalPriceWithTax.value > 10000) {
          // then it's the rocket
          order.deviceToken = BATMAN_DEVICE_TOKEN;
          order.alert = "new order from " + order.userName + " (€" + order.total + ")";
          sendNotification(order);
        } else {
          console.log("T", body.totalPriceWithTax.value);
          console.log("t", body.totalPriceWithTax.value < 10000);
          console.log("U", order.userName);
        }

      } else {
        console.log('Call to EC webservice failed with status code ' + response.statusCode)
        console.log(response.body)
      }
    } else {
      console.log(error)
    }
  })
}

function extractTraceHeaders(headers) {
  // Used to pass the headers through to the next calls, so that tracing will work
  console.log(headers)
  var map = {};
  for (var i in traceHeaders) {
    h = traceHeaders[i]
    headerVal = headers[h]
    console.log('header' + h + "-" + headerVal)
    if (headerVal !== undefined) {
      console.log('if not undefined header' + h + "-" + headerVal)
      map[h] = headerVal
    }
  }
  return map;
}

module.exports = {
  main: function (event, context) {
    orderCreotedEvent(event, context);
  }
}
