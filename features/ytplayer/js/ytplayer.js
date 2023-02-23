{
let fhServer = 'https://my.featurehub.net',
    fhScriptName = "/lib/v1/feature.js";
    
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname.indexOf('.local') !== -1) {
    fhServer = 'http://mbp-pks.local:8787';
    fhScriptName += '?r=' + Math.random();
}

const VIDEOS = {
    "video_button_a1" : {
        videoId: "7lJEDZsMm-Y"
    },

    "video_button_a2" : {
        videoId: "Y8rLKJIV7KE"
    },

    "video_button_a3" : {
        videoId: "Lm6bZ_oi1PA"
    },

    "video_button_b1" : {
        videoId: "ZX-03yBcm3k"
    },

    "video_button_b3" : {
        videoId: "vVRdnIuAOWM"
    }
}

let oFeature,
    oYtPlayer,
    bYtPlayerReady,
    bConnected,
fnConnect = function () {
    
    oFeature = new Feature({
        featureId: "net.metablet.fh.feature.ytplayer",
        clientId: "metaphone-test"
    });

    //TODO
    oFeature.m_oSocketClient.addEventListener("socketClose", () => {
        console.log("Feature Socket Disconnected.");
    });

    oFeature.addEventListener("connect", () => {
        console.log("Feature Socket Connected.");
    });

    oFeature.addEventListener("connect", () => {
        bConnected = true;
        initPlayer();
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

            if(oData.action === "CLICK"){
                const oVideo = VIDEOS[oData.gameObject];
                if(oVideo){
                    oYtPlayer.loadVideoById(oVideo.videoId, 0, "large");
                }
                
            }
        });

        
    });

    
},
initPlayer = function(){
    if(!bYtPlayerReady || !bConnected){
        return;
    }

    oYtPlayer = new YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: '7lJEDZsMm-Y',
        events: {
          'onReady': (event) => {
                oYtPlayer.playVideo();
            
          },
          'onStateChange': (event) => {

          }
        }
      });
};

const script = document.createElement('script');
script.src = fhServer + fhScriptName;
script.addEventListener('load', fnConnect);
document.body.appendChild(script);

const YTPlayer = {
    
    playerReady: function(){
        bYtPlayerReady = true;
        
        initPlayer();
    }
};
window.YTPlayer = YTPlayer;







}
