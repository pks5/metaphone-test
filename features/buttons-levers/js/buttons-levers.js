let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js",
    kcAuthUrl = "https://id.featurehub.net/realms/master/protocol/openid-connect/auth";
    
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.indexOf('.local') !== -1) {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
    kcAuthUrl = "http://mbp-pks.local:8282/realms/master/protocol/openid-connect/auth";
}

let oFeature,

fnConnect = function () {
    
    oFeature = new Feature({
        featureId: "io.himera.fh.feature.buttons_levers",
        clientId: "metaphone-test",
        authUrl: kcAuthUrl
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

    oFeature.addEventListener('ready', (event) => {
        console.log("READY", event);
        oFeature.subscribeToFeatureStream(true, (oData, mHeaders) => {
            console.log("Received feature message: ", oData);
            terminalLog("Received feature message: " + JSON.stringify(oData));
    
            if(oData.action === "SETUP_CALLBACK"){
                
            }
            else if(oData.action === "TOGGLE"){
                if(oData.gameObject === "button_on_off_demo"){
                    document.getElementById("button_on_off_demo").classList.toggle("active", oData.value === "0.75");
                }
                else if(oData.gameObject === "switch_demo"){
                    document.getElementById("switch_demo").classList.toggle("active", oData.value === "0.75");
                }
            }
            
        });
    
        oFeature.addEventListener("connect", () => {
            oFeature.sendMessageToGameObject("button_controller", {
                "action": "SETUP"
            });
        });
    });
    
};



let scriptLocation = fhServer + fhScriptName;

const script = document.createElement('script');
script.src = scriptLocation;
script.addEventListener('load', fnConnect);
document.body.appendChild(script);


document.getElementById("button_on_off_demo").addEventListener("click", function(){
    oFeature.sendMessageToGameObject("button_controller", {
        action: "SET_STATE",
        gameObject: "button_on_off_demo",
        value: this.classList.contains("active") ? 0 : 0.75
    });
});

document.getElementById("switch_demo").addEventListener("click", function(){
    oFeature.sendMessageToGameObject("button_controller", {
        action: "SET_STATE",
        gameObject: "switch_demo",
        value: this.classList.contains("active") ? 0 : 0.75
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