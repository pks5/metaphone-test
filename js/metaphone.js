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

let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js";
if (location.hostname.indexOf('.localnet') !== -1) {
    fhServer = "http://app.featurehub.localnet:8787";
    fhScriptName += '?r=' + Math.random();
}
else if (location.hostname === 'localhost' || location.hostname === 'mbp-pks.local') {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
}

let scriptLocation = fhServer + fhScriptName;

const script = document.createElement('script');
script.src = scriptLocation;
script.addEventListener('load', fnConnect);
document.body.appendChild(script);

let sClientId;
window.addEventListener('message', (event) => {
    
    if(event.data.message.action === 'SET_CLIENT_ID'){
        if(event.origin !== fhServer){
            // throw new Error("Only messages from FeatureHub are allowed!");
        }

        sClientId = event.data.message.clientId;
        console.log('New clientId is: ' + sClientId);

        oFeature.subscribeToFeatureStream(sClientId, (oData, mHeaders) => {
            console.log("Received feature message: ", oData);
            document.getElementById("message").value = JSON.stringify(oData);

            if(oData.action === "SETUP_CALLBACK"){
                setCharacter(oData.character);
            }
            else if(oData.action === "SET_CHARACTER_CALLBACK"){
                setCharacter(oData.character);
            }
        });

        oFeature.addEventListener("connect", () => {
            oFeature.sendMessageToGameObject(sClientId, "menu_receiver", {
                "action": "SETUP"
            });
        });

        
    }
});

function setCharacter(sCharacter){
    if(sCharacter === "male"){
        document.getElementById("female-card").classList.remove("bg-primary", "text-light");
        document.getElementById("male-card").classList.add("bg-primary", "text-light");
    }
    else if(sCharacter === "female"){
        document.getElementById("female-card").classList.add("bg-primary", "text-light");
        document.getElementById("male-card").classList.remove("bg-primary", "text-light");
    }
}