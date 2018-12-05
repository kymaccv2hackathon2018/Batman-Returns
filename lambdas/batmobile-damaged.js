/*
Dependencies:
{
    "dependencies": {
    "apn": "^2.2.0",
    "request": "^2.88.0"
  }
}

Service Bindings:
ec-occ-commerce-webservices-v2-ec692-overdue-cancel

*/

const apn = require('apn');
const request = require('request');

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
    key: key, //"./AuthKey_2LGBY37RFB.p8",
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
  notification.payload = {
    userId: data.userId,
    brandId: data.brandId,
    item: data.item,
    amount: data.amount
  };

  provider.send(notification, deviceTokens).then((response) => {
    console.log("SEND");
    provider.shutdown();
  });
}

module.exports = {
  main: function (event, context) {

    request.post({ url: `${process.env.GATEWAY_URL}/batstore/users/bruce_wayne@wayneenterprise.com/carts` }, function (error, response) {
      if (error) {
        throw new Error(error);
      }

      var data = JSON.parse(response.body);

      request.post({
        url: `${process.env.GATEWAY_URL}/batstore/users/bruce_wayne@wayneenterprise.com/carts/${data.code}/entries`,
        json: {
          product: {
            code: 'batmobile_lower_part'
          }
        }
      }, function (error, response, body) {
        if (error) {
          throw new Error(error);
        }

        console.log('addToCartResponse', body);
        notify('batmobile_lower_part');

      });
    });
  }
};

function notify(productId) {
  var ndata = {};
  ndata.deviceToken = BATMAN_DEVICE_TOKEN;
  ndata.alert = "Batmobile was damaged. Broken part " + productId + " is added to your cart.";
  ndata.badge = 1;
  ndata.userId = "BATMAN";
  ndata.item = "shop";
  ndata.amount = 3;
  ndata.brandId = "";

  sendNotification(ndata);
}
