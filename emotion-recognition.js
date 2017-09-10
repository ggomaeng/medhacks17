const ENV = require("./.env");
const fs = require("fs");
const EmotionApi = require("./emotionWrapper");
const firebase = require("firebase");
const moment = require("moment");
var express = require('express');
var path = require('path');
var app = express();
app.use('/', express.static(__dirname + '/'));

var cv = require("opencv");

firebase.initializeApp(ENV.FIREBASE);

init();


app.get('/', function (req, res) {
  // res.send('Hello World');
  res.sendFile(path.join(__dirname + '/index.html'));
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
})


function init() {
  try {
    var camera = new cv.VideoCapture(1);
    camera.setWidth(144);
    camera.setHeight(176);

    var window = new cv.NamedWindow("Video", 0);
    // face detection properties
    var rectColor = [0, 255, 0];
    var rectThickness = 2;

    setInterval(function() {
      camera.read(function(err, im) {
        if (err) throw err;
        console.log(im.size());
        if (im.size()[0] > 0 && im.size()[1] > 0) {
          im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
            if (err) throw err;

            if (faces.length > 0) {
              var buff = im.toBuffer();
              recognizeEmotionImage(buff);
            }

            for (var i = 0; i < faces.length; i++) {
              face = faces[i];
              im.rectangle(
                [face.x, face.y],
                [face.width, face.height],
                rectColor,
                rectThickness
              );
            }
            window.show(im);
          });
        }
        window.blockingWaitKey(0, 50);
      });
    }, 3000);
  } catch (e) {
    console.log("Couldn't start camera:", e);
    setTimeout(function() {
      init();
    }, 1000);
  }
}

//constructor
const emotionApi = new EmotionApi(ENV.EMOTION_API, "WUS");

// Webcam.capture("test_pic", function(err, data) { console.log(err);
// console.log(data); }); fs.readFile('./mark.jpg', function (err, data) { var
// encodedImage = new Buffer(data, 'binary').toString('base64');
// recognizeEmotionImage(encodedImage); })
// recognizeEmotionURL('https://upload.wikimedia.org/wikipedia/commons/f/fe/Mark
// _ Zuckerberg_em_setembro_de_2014.jpg');

function recognizeEmotionURL(url) {
  emotionApi
    .recognizeURL(url)
    .then(faceInfo => {
      // Resolves faceInfo, an array
      console.log(faceInfo);
    })
    .catch(err => {
      // If no faces are detected, an error will be returned An error can occur too if
      // an incorrect/invalid Face API subscription key or any other incorrect
      // parameters is provided. For more information on the kind of errors that
      // Microsoft's Face API returns, please refer to
      // https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cb
      // b e8d/operations/563879b61984550f30395236
      console.log(err);
    });
}

function recognizeEmotionImage(image) {
  emotionApi
    .recognizeImage(image)
    .then(faceInfo => {
      // Resolves faceInfo, an array
      console.log(faceInfo);
      if (faceInfo && faceInfo[0] && faceInfo[0].scores) {
        let score = faceInfo[0].scores;
        score.timestamp = moment().format();

        firebase
          .database()
          .ref(`feelings/${moment().format("dddd, MMMM Do YYYY")}`)
          .push(score);
      }
    })
    .catch(err => {
      // If no faces are detected, an error will be returned An error can occur too if
      // an incorrect/invalid Face API subscription key or any other incorrect
      // parameters is provided. For more information on the kind of errors that
      // Microsoft's Face API returns, please refer to
      // https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cb
      // b e8d/operations/563879b61984550f30395236
      console.log(err);
    });
}
