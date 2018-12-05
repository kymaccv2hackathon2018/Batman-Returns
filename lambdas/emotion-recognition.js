/*
Dependencies:
{
    "name": "emotion-detector",
    "dependencies": {
        "request": "^2.88.0",
        "moji-translate": "^1.0.2"
    }
*/

var translate = require('moji-translate');
var request = require('request');

const AUTHORIZATION = 'Simple <API KEY>';

module.exports = {
  main: function (event, context) {
    var reqBody = event.data;
    var image = reqBody.image;
    var productCode = reqBody.productCode;

    var input = {
      "image": image,
      "numResults": 3
    };
    console.log(input);

    var url = `https://api.algorithmia.com/v1/algo/deeplearning/EmotionRecognitionCNNMBP/1.0.1`;
    console.log('Making call to Algorithmia');

    request.post({
      url: url,
      json: input,
      headers: { 'Authorization': AUTHORIZATION }
    }, function (error, response, body) {
      if (error === null) {

        var emotions = body.result.results[0].emotions;
        var headline = "";
        var text = "I found this product ";
        var rating = 1;

        for (let i = 0; i < emotions.length; i++) {
          headline += emotions[i].label + " ";
          text += emotions[i].confidence + " " + emotions[i].label + ",";
          if (emotions[i].label === "Happy") {
            rating = 5 * emotions[i].confidence;
          }
        }

        var review_headline = translate.translate(headline);

        //add review
        var formData = {
          productCode: productCode,
          headline: review_headline,
          comment: text,
          rating: rating
        };

        url = "https://add-review-stage.sa-hackathon-01.cluster.extend.sap.cx";

        request.post({
          url: url,
          json: formData
        }, function (error, response, body) {
          if (error === null) {
            console.log(body);
          } else {
            console.log("error: " + error);
          }
        });
        //add review
      }
      else {
        console.log("error: " + error);
        console.log(`Failed to get product details: ${productCode}`);
      }
    });
  }
}
