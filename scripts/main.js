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

var obstacleAvatar = new Image;
obstacleAvatar.src = "./img/shell.png"
var obstacleAvatarScaleFactor = 0.075;
obstacleAvatar.width = obstacleAvatar.width * obstacleAvatarScaleFactor;
obstacleAvatar.height = obstacleAvatar.height * obstacleAvatarScaleFactor;

var playerPos = {x: gCanvas.width/2,y: gCanvas.height}
const RACING_LANES_COUNT = 3;
const RACING_ROWS_COUNT = 5;
var playerLane = 0;
var racingLanePos = {l: (gCanvas.width/RACING_LANES_COUNT)*0, c: (gCanvas.width/RACING_LANES_COUNT)*1, r: (gCanvas.width/RACING_LANES_COUNT)*2}


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
    document.getElementById("laneInfo").textContent=playerLane+": "+getLane(playerPos.x);
}, false);


const FPS = 20;
const MAX_LEVEL = 8;
var level = 1;
var drawFrameInterval = null;
var setObstaclesInterval = null;
gCanvas.addEventListener("click", function(evt){
    drawFrameInterval=setInterval(draw,1000/FPS);
    setObstaclesInterval=setInterval(setObstacles,1000/level);
},false)




function setPlayerLane(xPos){
    var lanePos=getLane(xPos);
    switch(lanePos){
        case racingLanePos.l:
            playerLane = -1;
            break;
        case racingLanePos.c:
            playerLane = 0;
            break;
        default:
            playerLane = 1;
    }
    return lanePos;
}
function getLane(xPos){
    if(xPos < gCanvas.width/RACING_LANES_COUNT){return racingLanePos.l;}
    else if(xPos < gCanvas.width/RACING_LANES_COUNT*2){return racingLanePos.c;}
    else{return racingLanePos.r;}
}



function draw(){
    var ctx = gCanvas.getContext("2d");
    ctx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    ctx.drawImage(playerAvatar, setPlayerLane(playerPos.x), gCanvas.height - playerAvatar.height, playerAvatar.width, playerAvatar.height);
    drawObstacles();
}
function drawObstacles(){
    var ctx = gCanvas.getContext("2d");

    for (let row = 0; row < RACING_ROWS_COUNT; row++) {
        if(obstaclesGrid[row][0] == true){ctx.drawImage(obstacleAvatar, getLane(gCanvas.width/RACING_LANES_COUNT-1)+obstacleAvatar.width/4, gCanvas.height - playerAvatar.height*(RACING_ROWS_COUNT-row), obstacleAvatar.width, obstacleAvatar.height)};
        if(obstaclesGrid[row][1] == true){ctx.drawImage(obstacleAvatar, getLane(gCanvas.width/RACING_LANES_COUNT*2-1)+obstacleAvatar.width/4, gCanvas.height - playerAvatar.height*(RACING_ROWS_COUNT-row), obstacleAvatar.width, obstacleAvatar.height)};
        if(obstaclesGrid[row][2] == true){ctx.drawImage(obstacleAvatar, getLane(gCanvas.width/RACING_LANES_COUNT*3)+obstacleAvatar.width/4, gCanvas.height - playerAvatar.height*(RACING_ROWS_COUNT-row), obstacleAvatar.width, obstacleAvatar.height)};
      } 
}



var obstaclesGrid = Array.from({length: RACING_ROWS_COUNT}, e => Array(RACING_LANES_COUNT).fill(false));
var isNewObstaclesCounter = 0;
function getRndPattern(min, max) {
    /*
    001: 1
    010: 2
    100: 4 <-> 3

    011: 3 <-> 4
    101: 5
    110: 6
    */
    return Math.floor(Math.random() * (max - min) ) + min;
  }
function setObstacles(){
    
    for(let row = RACING_ROWS_COUNT; row > 1; row--){
        obstaclesGrid[row-1] = obstaclesGrid[row-2].slice();
    }

    var newPattern = 0;
    if(isNewObstaclesCounter == 0){
        if(level < MAX_LEVEL/2){
            newPattern = getRndPattern(1,7);
        } else {
            newPattern = getRndPattern(4,7);
        }
    }


    switch (newPattern){
        case 1:
            obstaclesGrid[0][0] = false;
            obstaclesGrid[0][1] = false;
            obstaclesGrid[0][2] = true;
            break;
        case 2:
            obstaclesGrid[0][0] = false;
            obstaclesGrid[0][1] = true;
            obstaclesGrid[0][2] = false;
            break;
        case 3: //SWITCHED 4
            obstaclesGrid[0][0] = true;
            obstaclesGrid[0][1] = false;
            obstaclesGrid[0][2] = false;
            break;

        case 4: //SWITCHED 3
            obstaclesGrid[0][0] = false;
            obstaclesGrid[0][1] = true;
            obstaclesGrid[0][2] = true;
            break;
        case 5:
            obstaclesGrid[0][0] = true;
            obstaclesGrid[0][1] = false;
            obstaclesGrid[0][2] = true;
            break;
        case 6:
            obstaclesGrid[0][0] = true;
            obstaclesGrid[0][1] = true;
            obstaclesGrid[0][2] = false;
            break;
        default:
            obstaclesGrid[0][0] = false;
            obstaclesGrid[0][1] = false;
            obstaclesGrid[0][2] = false;
    }

    isNewObstaclesCounter = isNewObstaclesCounter+1;
    if(isNewObstaclesCounter == 3){isNewObstaclesCounter = 0;}
}





//DEBUG
document.getElementById("debugInfo").textContent=gCanvas.height+" x "+gCanvas.width;
//...