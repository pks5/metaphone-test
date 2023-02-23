{
let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js";
    
if (location.hostname === 'localhost' || location.hostname.indexOf('.local') !== -1) {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
}

const elCodeInput = document.getElementById("code"),
    oKeyTone = new Audio('./sounds/tone.mp3'),
    oSubmitTone = new Audio('./sounds/DTMF-1.mp3'),
    aKeys = document.querySelectorAll(".key-btn");

let oFeature,
    bError = false,
    iMessageTimeout,
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

            if(oData.action === "ERROR"){
                setMessage(oData.value);
            }
        });

        oFeature.addEventListener("connect", () => {
            

            
        });
    })
};

const script = document.createElement('script');
script.src = fhServer + fhScriptName;
script.addEventListener('load', fnConnect);
document.body.appendChild(script);

function setMessage(sMessage){
    clearInterval(iMessageTimeout);

    elCodeInput.value = sMessage;
    bError = true;

    iMessageTimeout = setTimeout(() => {
        elCodeInput.value = "";
        bError = false;
    }, 5000);
}



document.getElementById("submit-btn").addEventListener("click", () => {
    oSubmitTone.play();
    try{
        oFeature.sendMessageToEnvScript("door_controller", "open_close", { 
            action: "OPEN_CLOSE",
            value: elCodeInput.value 
        });
        elCodeInput.value = "";
    }
    catch(err){
        setMessage("ERROR");
    }
    
});

document.getElementById("c-btn").addEventListener("click", () => {
    if(bError){
        clearInterval(iMessageTimeout);
        elCodeInput.value="";
        bError = false;
    }
    else{
        elCodeInput.value=elCodeInput.value.slice(0, -1);
    }
    oKeyTone.play();
});


for(const oKey of aKeys){
    oKey.addEventListener("click", () => {
        if(bError){
            clearInterval(iMessageTimeout);
            elCodeInput.value = oKey.dataset.key;
            bError = false;
        }
        else{
            elCodeInput.value += oKey.dataset.key;
        }
        oKeyTone.play();
    });
}

}
