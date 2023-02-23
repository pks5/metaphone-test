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
    fnScriptLoad = function () {
    
    oFeature = new Feature({
        featureId: "net.metablet.fh.feature.numpad",
        clientId: "metaphone-test"
    });

    oFeature.messageMapping("set_value", (oEvent) => {
        setMessage(oEvent.body.value);
    });

    oFeature.connect();
};

const script = document.createElement('script');
script.src = fhServer + fhScriptName;
script.addEventListener('load', fnScriptLoad);
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
