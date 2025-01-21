const KEY_CODE_LEFT = 37;   
const KEY_CODE_A = 65;   
const KEY_CODE_RIGHT = 39;
const KEY_CODE_D = 68;   
const KEY_CODE_SPACE = 32;   

//Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

//Player constants
const playerWidth = 20;
const PLAYER_MAX_SPEED = 600.0;

const GAME_STATE = {
    lastTime: Date.now(),

    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    aPressed: false,
    dPressed: false,
    playerX: 0,
    playerY: 0
};

function clamp(v , min, max){ 

    if(v < min){
        return min;
    }else if(v > max){
        return max;
    }else{
        return v;
    }
}

//Player functions
function setPosition($el, x, y){
    $el.style.transform = `translate(${x}px, ${y}px)`;
}


//player creation
function createplayer($container){
    GAME_STATE.playerX = GAME_WIDTH / 2;
    GAME_STATE.playerY = GAME_HEIGHT - 85;
    const $player = document.createElement('img');
    $player.src = 'assets/player.png';
    $player.className = 'player';
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function updatePlayer(){

    if (GAME_STATE.leftPressed||GAME_STATE.aPressed) {
        GAME_STATE.playerX -= 5;
    }else if (GAME_STATE.rightPressed||GAME_STATE.dPressed) {
        GAME_STATE.playerX += 5;  
    }
    GAME_STATE.playerX = clamp(GAME_STATE.playerX, playerWidth, GAME_WIDTH - playerWidth);
    const $player = document.querySelector('.player');
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}


function init(){
    const $container = document.querySelector('.game');
    createplayer($container);
}

//Key events
function keyDown(e){
    if(e.keyCode === KEY_CODE_LEFT||e.keyCode === KEY_CODE_A){
        GAME_STATE.leftPressed = true;
        GAME_STATE.aPressed = true;
    }else if(e.keyCode === KEY_CODE_RIGHT||e.keyCode === KEY_CODE_D){
        GAME_STATE.rightPressed = true;
        GAME_STATE.dPressed = true;
    }else if(e.keyCode === KEY_CODE_SPACE){
        GAME_STATE.spacePressed = true;
    }
}

function keyUp(e){
    if(e.keyCode === KEY_CODE_LEFT||e.keyCode === KEY_CODE_A){
        GAME_STATE.leftPressed = false;
        GAME_STATE.aPressed = false;
    }else if(e.keyCode === KEY_CODE_RIGHT||e.keyCode === KEY_CODE_D){
        GAME_STATE.rightPressed = false;
        GAME_STATE.dPressed = false;
    }else if(e.keyCode === KEY_CODE_SPACE){
        GAME_STATE.spacePressed = false;
    }
}

//Game loop
function update(){
    updatePlayer();
    window.requestAnimationFrame(update);

}



init();
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.requestAnimationFrame(update);