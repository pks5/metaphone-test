let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js",
    kcAuthUrl = "https://id.featurehub.net/realms/master/protocol/openid-connect/auth";
    
if (location.hostname === 'localhost' || location.hostname.indexOf('.local') !== -1) {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
    kcAuthUrl = "http://mbp-pks.local:8080/realms/master/protocol/openid-connect/auth";
}

let oFeature,
fnConnect = function () {
    
    oFeature = new Feature({
        featureId: "net.featurehub.tp.sysf.metaworld",
        clientId: "metaphone-test",
        authUrl: kcAuthUrl
    });

    //TODO
    oFeature.m_oSocketClient.addEventListener("socketClose", () => {
        console.log("Feature Socket Disconnected.");
    });

    oFeature.addEventListener("connect", () => {
        console.log("Feature Socket Connected.");
        terminalLog("Feature Socket connected.");
    });

    console.log("Connecting to FeatureHub ...");
    oFeature.connect(oServerInfo => {
        console.log("Connected to " + oServerInfo.webSocketUrl);
    });
};

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
            terminalLog("Received message: " + JSON.stringify(oData));

            if(oData.action === "SETUP_CALLBACK"){
                setCharacter(oData.value);
            }
            else if(oData.action === "SET_CHARACTER_CALLBACK"){
                setCharacter(oData.value);
            }
        });

        oFeature.addEventListener("connect", () => {
            oFeature.sendMessageToGameObject(sClientId, "menu_receiver", {
                "action": "SETUP"
            });

            oFeature.sendMessageToGameObject(sClientId, "photon_controller", {
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

document.getElementById("send-btn").addEventListener("click", () => {
    oFeature.sendMessageToGameObject(sClientId, "photon_controller", {
        action: "JOIN_RANDOM_ROOM"
    });
});

document.getElementById("male-card").addEventListener("click", () => {
    terminalLog("Requesting changing character to male ...");
    oFeature.sendMessageToGameObject(sClientId, "menu_receiver", { 
        action: "SET_CHARACTER",
        value: "male" 
    });
});

document.getElementById("female-card").addEventListener("click", () => {
    terminalLog("Requesting changing character to female ...");
    oFeature.sendMessageToGameObject(sClientId, "menu_receiver", { 
        action: "SET_CHARACTER",
        value: "female" 
    });
});

const term = new Terminal();
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);
term.open(document.getElementById('xterm-container'));
/*
term.attachCustomKeyEventHandler(data => {
    console.log(data)
    term.write(data.key);
});
*/
fitAddon.fit();

terminalLog = function(sMessage, sLevel){
    let sColor = '\x1b[37m';
    if(sLevel === "error"){
      sColor = '\x1b[1;31m';
    }
    
    term.writeln(sColor + sMessage); 
};