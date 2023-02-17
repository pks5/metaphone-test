let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js";
    
if (location.hostname === 'localhost' || location.hostname.indexOf('.local') !== -1) {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
}

let oFeature,
fnConnect = function () {
    
    oFeature = new Feature({
        featureId: "net.metablet.fh.feature.numpad",
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

    oFeature.addEventListener("ready", (event) => {
        console.log("READY", event);
        oFeature.subscribeToFeatureStream(true, (oData, mHeaders) => {
            console.log("Received feature message: ", oData);
            console.log("Received message: " + JSON.stringify(oData));

            
        });

        oFeature.addEventListener("connect", () => {
            

            
        });
    })
};

let scriptLocation = fhServer + fhScriptName;

const script = document.createElement('script');
script.src = scriptLocation;
script.addEventListener('load', fnConnect);
document.body.appendChild(script);

const elCodeInput = document.getElementById("code"),
    oKeyTone = new Audio('./sounds/tone.mp3');

document.getElementById("submit-btn").addEventListener("click", () => {
    oFeature.sendMessageToGameObject("door_controller", { 
        action: "OPEN_CLOSE",
        value: elCodeInput.value 
    });
    elCodeInput.value = "";
});

document.getElementById("c-btn").addEventListener("click", () => {
    elCodeInput.value=elCodeInput.value.slice(0, -1);
    oKeyTone.play();
});

const aKeys = document.querySelectorAll(".key-btn");
for(const oKey of aKeys){
    oKey.addEventListener("click", () => {
        elCodeInput.value += oKey.dataset.key;
        oKeyTone.play();
    });
}


