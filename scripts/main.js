var gCanvas = document.getElementById("gameCanvas");
var ctx = gCanvas.getContext("2d");
var defaultFont = "3vw Helvetica";
var detailFont = "1vw Helvetica";

var playerAvatar = new Image;
playerAvatar.src = "./img/kart.png";
var obstacleAvatar = new Image;
obstacleAvatar.src = "./img/shell.png"
var winAvatar = new Image;
winAvatar.src = "./img/trophy.png"



function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
gCanvas.addEventListener("mousemove", function (evt) {
    playerPos = getMousePos(gCanvas, evt);
}, false);
gCanvas.addEventListener("click", function(evt){
    reset();
},false)
window.addEventListener("resize",init);

const FPS = 60;
//const MAX_LEVEL = 9;
const MAX_LEVEL = 3;
const RACING_LANES_COUNT = 3;
const RACING_ROWS_COUNT = 5;
const TO_NEXT_LEVEL_INDICATOR_COUNT = ctx.canvas.width/20;

var drawFrameInterval = null;
var setObstaclesInterval = null;

var obstaclesGrid = null;
var level = null;
var playerPos = null;
var playerLane = null;
var racingLanePos = null;
var newObstaclesCounter = null;
var gameLost = null;
var gameWon = null;


function sizeCanvas(){
    ctx.canvas.height = window.innerHeight*0.90;
    ctx.canvas.width  = window.innerWidth*0.30;

    winAvatar.width = ctx.canvas.width*0.5;
    winAvatar.height = winAvatar.width;

    obstacleAvatar.width = ctx.canvas.width*0.22;
    obstacleAvatar.height = ctx.canvas.width*0.18;

    playerAvatar.width = ctx.canvas.width*0.33;
    playerAvatar.height = playerAvatar.width;
}

function init(){
    clearInterval(drawFrameInterval);
    clearInterval(setObstaclesInterval);

    sizeCanvas();

    ctx.font = defaultFont;
    gCanvas.style.border = "1px solid #FF0000";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Click to (re)start!", gCanvas.width/2, gCanvas.height - 50);
}
function reset(){
    clearInterval(drawFrameInterval);
    clearInterval(setObstaclesInterval);
    ctx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    
    ctx.fillStyle = "red";
    gCanvas.style.border = "1px solid #FF0000";
    
    level = 1;
    
    obstaclesGrid = Array.from({length: RACING_ROWS_COUNT}, e => Array(RACING_LANES_COUNT).fill(false));
    playerPos = {x: gCanvas.width/2,y: gCanvas.height}
    playerLane = 0;
    racingLanePos = {l: (gCanvas.width/RACING_LANES_COUNT)*0, c: (gCanvas.width/RACING_LANES_COUNT)*1, r: (gCanvas.width/RACING_LANES_COUNT)*2}

    newObstaclesCounter = 0;
    gameLost = false;
    gameWon = false;

    drawFrameInterval=setInterval(draw,1000/FPS);
    setObstaclesInterval=setInterval(setObstacles,1000/level);
}
function draw(){
    //DEBUG
    document.getElementById("debugInfo").textContent=newObstaclesCounter + "/" +3*RACING_ROWS_COUNT*level;
    document.getElementById("mouseInfo").textContent=level;
    
    ctx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    ctx.strokeStyle = "rgb(50 0 0)";
    var toNextLevel = 3*RACING_ROWS_COUNT*level;
    var levelIndicator = "-".repeat(newObstaclesCounter*TO_NEXT_LEVEL_INDICATOR_COUNT/toNextLevel);
    ctx.strokeText(levelIndicator+level+levelIndicator, gCanvas.width/2, gCanvas.height/2);

    drawPlayer();
    drawObstacles();
    checkWinState();
}
function drawPlayer(){
    ctx.drawImage(playerAvatar, setPlayerLane(playerPos.x), gCanvas.height - playerAvatar.height, playerAvatar.width, playerAvatar.height);
}
function drawObstacles(){
    for (let row = 0; row < RACING_ROWS_COUNT; row++) {
        if(obstaclesGrid[row][0] == true){ctx.drawImage(obstacleAvatar, getLane(gCanvas.width/RACING_LANES_COUNT-1)+obstacleAvatar.width/4, gCanvas.height - playerAvatar.height*(RACING_ROWS_COUNT-row), obstacleAvatar.width, obstacleAvatar.height)};
        if(obstaclesGrid[row][1] == true){ctx.drawImage(obstacleAvatar, getLane(gCanvas.width/RACING_LANES_COUNT*2-1)+obstacleAvatar.width/4, gCanvas.height - playerAvatar.height*(RACING_ROWS_COUNT-row), obstacleAvatar.width, obstacleAvatar.height)};
        if(obstaclesGrid[row][2] == true){ctx.drawImage(obstacleAvatar, getLane(gCanvas.width/RACING_LANES_COUNT*3)+obstacleAvatar.width/4, gCanvas.height - playerAvatar.height*(RACING_ROWS_COUNT-row), obstacleAvatar.width, obstacleAvatar.height)};
    } 
}
function checkWinState(){
    gameLost = (obstaclesGrid[RACING_ROWS_COUNT-1][playerLane] == true) ? true : false;
    gameWon = level == MAX_LEVEL;

    if(gameLost){
        clearInterval(drawFrameInterval);
        clearInterval(setObstaclesInterval);
        ctx.clearRect(0, 0, gCanvas.width, gCanvas.height/3);

        ctx.fillText("You crashed :(", gCanvas.width/2, gCanvas.height/3);
    } else if (gameWon)
    {
        clearInterval(drawFrameInterval);
        clearInterval(setObstaclesInterval);
        ctx.clearRect(0, 0, gCanvas.width, gCanvas.height - playerAvatar.height);


        ctx.drawImage(winAvatar, gCanvas.width/2-winAvatar.width/2+5, 10, winAvatar.width, winAvatar.height);
        ctx.fillStyle = "green";
        gCanvas.style.border = "1px solid #00FF00";
        ctx.fillText("Congratulations!", gCanvas.width/2, gCanvas.height/2);
        ctx.font = detailFont;
        ctx.fillText("(envoyez moi une photo identifiable de votre", gCanvas.width/2, 2*gCanvas.height/3);
        ctx.fillText("écran comme preuve de votre victoire)", gCanvas.width/2, 2*gCanvas.height/3+15);
        ctx.font = defaultFont;
    }
}





function setPlayerLane(xPos){
    var lanePos=getLane(xPos);
    switch(lanePos){
        case racingLanePos.l:
            playerLane = 0;
            break;
        case racingLanePos.c:
            playerLane = 1;
            break;
        default:
            playerLane = 2;
    }
    return lanePos;
}
function getLane(xPos){
    if(xPos < gCanvas.width/RACING_LANES_COUNT){return racingLanePos.l;}
    else if(xPos < gCanvas.width/RACING_LANES_COUNT*2){return racingLanePos.c;}
    else{return racingLanePos.r;}
}

function getRndPattern(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
function setObstacles(){
    
    //Rotate rows
    for(let row = RACING_ROWS_COUNT; row > 1; row--){
        obstaclesGrid[row-1] = obstaclesGrid[row-2].slice();
    }

    var newPattern = 0;
    if(newObstaclesCounter%3 == 0){
        if(level <= MAX_LEVEL/2-1 || level == MAX_LEVEL-1){
            newPattern = getRndPattern(1,7);
        } else {
            newPattern = getRndPattern(4,7);
        }
    }



    /*
    001: 1
    010: 2
    100: 4 <-> 3

    011: 3 <-> 4
    101: 5
    110: 6
    */
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

    newObstaclesCounter = newObstaclesCounter+1;
    if(newObstaclesCounter >= 3*RACING_ROWS_COUNT*level){
        newObstaclesCounter = 0;
        level = level + 1;

        clearInterval(setObstaclesInterval);
        setObstaclesInterval=setInterval(setObstacles,1000/level);
    }
}


init();
