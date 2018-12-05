/*
Dependencies:
{
    "name": "asdftg",
    "dependencies": {
        "request": "^2.88.0"
    }
}

Service Bindings:
ec-occ-commerce-webservices-v2-ec692-overdue-cancel
*/


const request = require('request');

module.exports = {
  main: function (event, context) {
    console.log(event.data);

    var productCode = event.data.productCode;
    var headline = event.data.headline;
    var comment = event.data.comment;
    var rating = parseFloat(event.data.rating);

    if (!productCode) {
      throw new Error('Invalid product code');
    }

    if (!headline || headline === '') {
      throw new Error('No headline supplied');
    }

    if (!comment || comment === '') {
      throw new Error('No comment supplied');
    }

    if (isNaN(rating)) {
      throw new Error('Invalid rating');
    }

    console.log("Product [" + productCode + "] gets a review!"); //test

    var url = `${process.env.GATEWAY_URL}/batstore/products/${productCode}/reviews`;
    console.log('Making call to OCC');
    console.log(url);
    console.log('');

    request.post({
      url: url,
      form: {
        headline: headline,
        comment: comment,
        rating: rating
      }
    }, function (error, response, body) {
      if (error === null) {
        console.log('OCC response body');
        console.log(body);
        console.log('');
      }
      else {
        console.log("error: " + error);
        console.log(`Failed to get product details: ${productCode}`);
      }
    });
  }
}
