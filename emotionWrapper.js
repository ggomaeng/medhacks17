'use strict';

// Require dependencies
const request = require('request-promise-native');
const querystring = require('querystring');

// Region settings
const regionArr = [{
        regionCode: 'WUS',
        regionName: 'westus'
    },
    {
        regionCode: 'EUS2',
        regionName: 'eastus2'
    },
    {
        regionCode: 'WCUS',
        regionName: 'westcentralus'
    },
    {
        regionCode: 'WEU',
        regionName: 'westeurope'
    },
    {
        regionCode: 'SEA',
        regionName: 'southeastasia'
    }
];

// Cognitive services face api base url
const baseUrl = '.api.cognitive.microsoft.com/emotion/v1.0';

// Helper functions
const matchRegion = (regionCode) => {
    // Declarations
    var error;

    // If region code is empty, throw an error
    if (regionCode === '') {
        error = new Error('Region code not specified!');
        throw error;
    }

    // Match regionCode input to regionArr
    let match = regionArr.filter((regionObject) => {
        return regionObject.regionCode === regionCode.toString().toUpperCase();
    });

    // Check if matched value is valid
    if (match.length <= 0) {
        // Throw error if no valid region is matched
        error = new Error('Invalid region code, only WUS, EUS2, WCUS, WEU & SEA is available!');
        throw error;
    } else {
        // Construct face API url by region and return
        return constructRegionUrl(match[0].regionName);
    }
}

const constructRegionUrl = (regionName) => {
    // Construct region url
    return `https://${regionName}${baseUrl}`;
}

// Create constructor
function EmotionApi(emotionApi, regionCode) {
    // Constructor properties
    this.subscriptionKey = emotionApi;
    this.apiUrl = matchRegion(regionCode);
}

EmotionApi.prototype.recognizeImage = function (data) {
    return new Promise((resolve, reject) => {
        // Declarations
        var error;

        request({
                method: 'POST',
                url: `${this.apiUrl}/recognize`,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': this.subscriptionKey
                },
                body: data
            })
            .then((resp) => {
                // Construct resolve object
                let faceInfo = new Object();

                // Assign response as object to faceInfo
                faceInfo = JSON.parse(resp);

                // Determine if any faces are detected
                if (faceInfo.length === 0) {
                    // Reject promise with error for 0 face detected
                    error = new Error('No face is detected.');
                    return reject(error);
                } else {
                    // Resolve promise with faceInfo object
                    return resolve(faceInfo);
                }
            })
            .catch((err) => {
                // Log error
                console.log(`An error occurred with detect: ${err.message}`);

                // Reject promise with error
                return reject(err);
            });
    });
}

EmotionApi.prototype.recognizeURL = function (url) {
    return new Promise((resolve, reject) => {
        // Declarations
        var error;

        request({
                method: 'POST',
                url: `${this.apiUrl}/recognize`,
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': this.subscriptionKey
                },
                body: `{"url": "${url}"}`
            })
            .then((resp) => {
                // Construct resolve object
                let faceInfo = new Object();

                // Assign response as object to faceInfo
                faceInfo = JSON.parse(resp);

                // Determine if any faces are detected
                if (faceInfo.length === 0) {
                    // Reject promise with error for 0 face detected
                    error = new Error('No face is detected.');
                    return reject(error);
                } else {
                    // Resolve promise with faceInfo object
                    return resolve(faceInfo);
                }
            })
            .catch((err) => {
                // Log error
                console.log(`An error occurred with detect: ${err.message}`);

                // Reject promise with error
                return reject(err);
            });
    });
}

module.exports = EmotionApi;