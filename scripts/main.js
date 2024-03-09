var gCanvas = document.getElementById("gameCanvas");
var ctx = gCanvas.getContext("2d");
ctx.font = "50px Helvetica";
ctx.fillStyle = "red";
ctx.fillText("Click to start!", gCanvas.width - 342, gCanvas.height - 50);


var playerAvatar = new Image;
playerAvatar.src = "./img/kart.png";
var playerAvatarScaleFactor = 0.1;
playerAvatar.width = playerAvatar.width * playerAvatarScaleFactor;
playerAvatar.height = playerAvatar.height * playerAvatarScaleFactor;
var playerPos = {x: gCanvas.width/2,y: gCanvas.height}
var racingLaneCount = 3
var playerLane = 0;
var racingLanePos = {l: (gCanvas.width/3)*0, c: (gCanvas.width/3)*1, r: (gCanvas.width/3)*2}
console.log(racingLanePos);

function getPlayerLane(xPos){
    if(xPos < gCanvas.width/3){playerLane = -1; return racingLanePos.l;}
    else if(xPos < gCanvas.width/3*2){playerLane = 0; return racingLanePos.c;}
    else{playerLane = 1; return racingLanePos.r;}
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
gCanvas.addEventListener("mousemove", function (evt) {
    playerPos = getMousePos(gCanvas, evt);

    //DEBUG
    document.getElementById("mouseInfo").textContent=playerPos.y + "," + playerPos.x;
    document.getElementById("laneInfo").textContent=playerLane+": "+getPlayerLane(playerPos.x);
}, false);





var drawFrameInterval = null;
gCanvas.addEventListener("click", function(evt){drawFrameInterval=setInterval(draw,1000/FPS);},false)

const FPS = 20;
function draw(){
    var ctx = gCanvas.getContext("2d");
    ctx.clearRect(0, 0, gCanvas.width, gCanvas.height);

    ctx.drawImage(playerAvatar, getPlayerLane(playerPos.x), gCanvas.height - playerAvatar.height, playerAvatar.width, playerAvatar.height);

}






//DEBUG
document.getElementById("debugInfo").textContent=gCanvas.height+" x "+gCanvas.width;
//...