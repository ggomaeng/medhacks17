const API_KEY = require('./env');
const fs = require('fs');
const EmotionApi = require('./emotionWrapper');

var GoPro = require('goproh4');

var cam = new GoPro.Camera();
// Set camera mode
cam.mode(GoPro.Settings.Modes.Video, GoPro.Settings.Submodes.Video.Video)

// Set camera resolution
.then(function () {
    return cam.set(GoPro.Settings.VIDEO_RESOLUTION, GoPro.Settings.VideoResolution.R1080S)
})

// Set camera framerate
.then(function () {
    return cam.set(GoPro.Settings.VIDEO_FPS, GoPro.Settings.VideoFPS.F60)
})

// Begin recording
.then(function () {
    console.log('[video]', 'started')
    return cam.start()
})
//constructor
const emotionApi = new EmotionApi(API_KEY.EMOTION_API, "WUS");

// Webcam.capture("test_pic", function(err, data) { console.log(err);
// console.log(data); });

// fs.readFile('./mark.jpg', function (err, data) {     var encodedImage = new
// Buffer(data, 'binary').toString('base64');
// recognizeEmotionImage(encodedImage); })
// recognizeEmotionURL('https://upload.wikimedia.org/wikipedia/commons/f/fe/Mark_
// Zuckerberg_em_setembro_de_2014.jpg');

function recognizeEmotionURL(url) {
    emotionApi
        .recognizeURL(url)
        .then((faceInfo) => {
            // Resolves faceInfo, an array
            console.log(faceInfo);
        })
        .catch((err) => {
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
        .then((faceInfo) => {
            // Resolves faceInfo, an array
            console.log(faceInfo);
        })
        .catch((err) => {
            // If no faces are detected, an error will be returned An error can occur too if
            // an incorrect/invalid Face API subscription key or any other incorrect
            // parameters is provided. For more information on the kind of errors that
            // Microsoft's Face API returns, please refer to
            // https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cb
            // b e8d/operations/563879b61984550f30395236
            console.log(err);
        });
}