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

    oFeature.addEventListener("connect", () => {
        bConnected = true;
        initPlayer();
    });

    oFeature.messageMapping("button_click", (oEvent) => {
        const oVideo = VIDEOS[oEvent.body.gameObject];
        if(oVideo){
            oYtPlayer.loadVideoById(oVideo.videoId, 0, "large");
        }
    });

    oFeature.connect();
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
