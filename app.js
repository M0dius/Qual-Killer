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
const PLAYER_MAX_SPEED = 400.0;
const LASER_MAX_SPEED = 200.0;
const LASER_COOLDOWN = 0.35;

//Enemy constants
const ENEMY_PER_ROW = 10;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;

const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    aPressed: false,
    dPressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    enemy: []
};

function rectIntersect(r1, r2){ 

return !(   r2.left>r1.right || 
            r2.right<r1.left || 
            r2.top>r1.bottom || 
            r2.bottom<r1.top
        );


}

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

function createLaser($container, x, y){
    const $element = document.createElement('img');
    $element.src = 'assets/projectile.png';
    $element.className = 'laser';
    $container.appendChild($element);
    const laser = {x,y,$element};
    GAME_STATE.lasers.push(laser);
    setPosition($element, x, y);
    const audio = new Audio('assets/laser3.mp3');
    audio.play();
}


function updatePlayer(dt,$container){
    if (GAME_STATE.leftPressed||GAME_STATE.aPressed) {
        GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
    }else if (GAME_STATE.rightPressed||GAME_STATE.dPressed) {
        GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;  
    }

    GAME_STATE.playerX = clamp(GAME_STATE.playerX, playerWidth, GAME_WIDTH - playerWidth);


    if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
        createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
        GAME_STATE.playerCooldown = LASER_COOLDOWN;
    }

    if (GAME_STATE.playerCooldown > 0) {
        GAME_STATE.playerCooldown -= dt;
    }
   
    const $player = document.querySelector('.player');
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

//enemy functions

function createEnemy($container, x, y){

    const $element = document.createElement('img');
    $element.src = 'assets/enemy.png';
    $element.className = 'enemy';
    $container.appendChild($element);
    const enemy = {x,y,$element};
    GAME_STATE.enemy.push(enemy);
    setPosition($element, x, y);

}
function updateEnemy(dt,$container){

    //time based movement
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;
    const enemies = GAME_STATE.enemy;   
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const x = enemy.x + dx;
        const y = enemy.y + dy;
        setPosition(enemy.$element, x, y);
    }
}

function destroyEnemy($container, enemy){
    $container.removeChild(enemy.$element);
    enemy.isDead = true;
}

//laser functions
function updateLasers(dt,$container){
const lasers = GAME_STATE.lasers;

for(let i = 0; i < lasers.length; i++){
    const laser = lasers[i];
    laser.y -= dt * LASER_MAX_SPEED;

    if(laser.y < 0){
        destroyLaser($container, laser);
    }

    setPosition(laser.$element, laser.x, laser.y);
    const r1 = laser.$element.getBoundingClientRect();
    const enemies = GAME_STATE.enemy;
    
    for(let j = 0; j < enemies.length; j++){
        const enemy = enemies[j];
        if(enemy.isDead){
            continue;
        }
        const r2 = enemy.$element.getBoundingClientRect();
        if(rectIntersect(r1, r2)){
            destroyLaser($container, laser);
            destroyEnemy($container, enemy);
            break;
        }
    }
}
GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function destroyLaser($container, laser){
    $container.removeChild(laser.$element);
    laser.isDead = true;
}
//Game loop
function update(){
    const $container = document.querySelector('.game');
    const currentTime = Date.now();
    const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;
    
    updatePlayer(dt,$container);
    updateLasers(dt,$container);
    updateEnemy(dt,$container);
    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);
}

//Game initialization
function init(){
    const $container = document.querySelector('.game');
    createplayer($container);
    const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMY_PER_ROW - 1);

    //enemy creation and formation 
    for(let j = 0; j < 4; j++){
        const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING;
        for(let i = 0; i < ENEMY_PER_ROW; i++){
            const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING;
            createEnemy($container, x, y);
        } 
    }

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


init();
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.requestAnimationFrame(update);