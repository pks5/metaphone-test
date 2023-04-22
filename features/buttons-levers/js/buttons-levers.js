let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js";
    
if (location.hostname === 'feature.metablet.localnet') {
    fhServer = 'http://app.featurehub.localnet:8787';
    fhScriptName += '?r=' + Math.random();
}
else if (location.hostname === 'mbp-pks.fritz.box') {
    fhServer = 'http://mbp-pks.fritz.box:8787';
    fhScriptName += '?r=' + Math.random();
}
else if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.indexOf('.local') !== -1) {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
}

let oFeature,

fnConnect = function () {
    
    oFeature = new Feature({
        featureId: "io.himera.fh.feature.buttons_levers",
        clientId: "metaphone-test"
    });

    oFeature.featureStreamMapping("item_collect", (oEvent) => {
        const oData = oEvent.body;
        terminalLog("Received message from item: id=" + oData.itemId + ", name=" + oData.itemName);

        const bSuccess = true;//Math.random() < 0.5;
        if(bSuccess){
            const elCoinsCounter = document.getElementById("coins-counter");
            elCoinsCounter.textContent = parseInt(elCoinsCounter.textContent) + 1;
        }
        
        //Respond
        oFeature.sendMessage("fhtp://item/item-controller-123/item-callback", { 
            itemName: oData.itemName,
            itemId: oData.itemId,
            success: bSuccess
        });
    });

    oFeature.featureStreamMapping("button", (oEvent) => {
        document.getElementById("button-star").classList.toggle("active", oEvent.body.value === "ACTIVE");
    });

    
    oFeature.connect();
};



let scriptLocation = fhServer + fhScriptName;

const script = document.createElement('script');
script.src = scriptLocation;
script.addEventListener('load', fnConnect);
document.body.appendChild(script);


document.getElementById("button-star").addEventListener("click", function(){
    /*
    oFeature.sendMessageToEnvScript("button_controller", "set_state", {
        action: "SET_STATE",
        gameObject: "switch_demo",
        value: this.classList.contains("active") ? 0 : 0.75
    });
    */
    oFeature.sendMessage("fhtp://item/item-controller-123/env/script/door_controller/open_close", { "value" : "1234" });
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