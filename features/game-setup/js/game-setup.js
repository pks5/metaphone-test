let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js";
    
if (location.hostname === 'localhost' || location.hostname.indexOf('.local') !== -1) {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
}

let oFeature,
fnScriptLoad = function () {
    
    oFeature = new Feature({
        featureId: "net.featurehub.tp.sysf.metaworld",
        clientId: "metaphone-test"
    });

    oFeature.messageMapping("setup_callback", (oEvent) => {
        //terminalLog("Message mapping: " + JSON.stringify(oEvent));
        terminalLog("Received message: " + JSON.stringify(oEvent.body));
        setCharacter(oEvent.body.value);
    });

    oFeature.addEventListener("ready", (event) => {
        console.log("READY", event);
        oFeature.sendMessageToEnvScript("scene_controller", "setup");
    });

    oFeature.connect();
};

let scriptLocation = fhServer + fhScriptName;

const script = document.createElement('script');
script.src = scriptLocation;
script.addEventListener('load', fnScriptLoad);
document.body.appendChild(script);

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
    oFeature.sendMessageToEnvScript("scene_controller", "change_scene", {
        action: "JOIN_RANDOM_ROOM"
    });
});

document.getElementById("male-card").addEventListener("click", () => {
    terminalLog("Requesting changing character to male ...");
    oFeature.sendMessageToEnvScript("menu_receiver", "set_character", { 
        action: "SET_CHARACTER",
        value: "male" 
    });
});

document.getElementById("female-card").addEventListener("click", () => {
    terminalLog("Requesting changing character to female ...");
    oFeature.sendMessageToEnvScript("menu_receiver", "set_character", { 
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