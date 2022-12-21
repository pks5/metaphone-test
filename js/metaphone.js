let oFeature;

let fnConnect = function () {
    oFeature = new Feature({
        featureId: "net.featurehub.tp.sysf.metaworld",
        clientId: "metaphone-test"
    });

    //TODO
    oFeature.m_oSocketClient.addEventListener("socketClose", () => {
        console.log("Feature Socket Disconnected.");
    });

    oFeature.addEventListener("connect", () => {
        console.log("Feature Socket Connected.");
    });

    console.log("Connecting to FeatureHub ...");
    oFeature.connect(oServerInfo => {
        console.log("Connected to " + oServerInfo.webSocketUrl);
    });
};

let scriptLocation = 'https://my.featurehub.net/lib/v1/feature.js';

if (location.hostname.indexOf('.localnet') !== -1) {
    //  scriptLocation = 'http://app.featurehub.localnet:8787/lib/v1/fhub.js';
}

scriptLocation = 'http://mbp-pks.local:8787/lib/v1/feature.js';
scriptLocation = 'http://app.featurehub.localnet:8787/lib/v1/feature.js';

const script = document.createElement('script');
script.src = scriptLocation;
script.addEventListener('load', fnConnect);
document.body.appendChild(script);

let sClientId;
window.addEventListener('message', (event) => {
    sClientId = event.data.message.clientId;
    console.log('New clientId is: ' + sClientId);
});