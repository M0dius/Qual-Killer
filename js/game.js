//global variable for game container
const $gameContainer = document.querySelector('.game')
const $score = document.querySelector('.score')
const $lives = document.querySelector('.lives')
let score = 0
let lives = 3
let isRunning = true

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

/*PLAYER PROPERTIES*/
const PLAYER_WIDTH = 60
//all speeds are in milliseconds
const PLAYER_MAX_SPEED = 300
const LASER_MAX_SPEED = 300
const LASER_COOLDOWN = 0.5

/*ENEMY PROPERTIES*/
const ENEMIES_PER_ROW = 10
const ENEMY_HORIZONTAL_PADDING = 80
const ENEMY_VERTICAL_PADDING = 70
const ENEMY_VERTICAL_SPACING = 80
const ENEMY_COOLDOWN = 15.0;

//stores everything happening in the game at any given time
const GAME_STATE = {
    lastTime: Date.now(),
    rightArrowPressed: false,
    leftArrowPressed: false,
    lowerAPressed: false,
    lowerDPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    enemies: [],
    enemyLasers: [],
    gameOver: false,
    gamePaused: false
}

function rectsIntersect(r1, r2) {
    //if these conditions are NOT met, the hitboxes are intersecting
    return !(
        //if the left side of r2 is on the right of the right side of r1, hitbox cannot be intersecting
        r2.left > r1.right ||
        //if the right side of r2 is on the left of the left side of r1, hitbox cannot be intersecting
        r2.right < r1.left ||
        //if the top of r2 is below the bottom side of r1, hitbox cannot be intersecting
        r2.top > r1.bottom ||
        //if the bottom side of r2 is atop of the top side of r1, hitbox cannot be intersecting
        r2.bottom < r1.top
    );
}

function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px, ${y}px)`
}

function clamp(v, min, max) {
    /*if v is less than min, return min
    if v is greater than max, return max, else return v
    ternary because fancy*/
    return v < min ? min : v > max ? max : v;
}

function rand(min, max) {
    //sets the default values when not provided 
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
    /*generate a value between 0 and 1, which is then multiplied 
    by the range. minimum value is then added again*/
    return min + Math.random() * (max - min);
}

function createPlayer($container) {
    /*setting the player's X and Y properties to it's middle using
    in CSS helps us here as we do not have to compensate for the usual off-set!*/

    //sets player position on the Y axis of the game container
    GAME_STATE.playerX = GAME_WIDTH / 2;
    //sets player position on the X axis of the game container
    GAME_STATE.playerY = GAME_HEIGHT - 120
    ;
    //creating an image element for the player
    const $player = document.createElement('img')
    //image source
    $player.src = 'assets/images/player/Frieren.png'
    $player.className = 'player'
    $container.appendChild($player)
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY)
}

function destroyPlayer($container, player) {
    lives = lives - 1
    if (lives <= 0) {
        $container.removeChild(player);
        GAME_STATE.gameOver = true;
    }
}

function updatePlayer(deltaTime) {
    /*although a switch-case statement is more appropriate here,
    it would allow the player to move in both directions at once*/
    if (GAME_STATE.rightArrowPressed) {
        //time*speed = distance
        GAME_STATE.playerX += deltaTime*PLAYER_MAX_SPEED
    }
    if (GAME_STATE.leftArrowPressed) {
        GAME_STATE.playerX -= deltaTime*PLAYER_MAX_SPEED
    }
    if (GAME_STATE.lowerDPressed) {
        GAME_STATE.playerX += deltaTime*PLAYER_MAX_SPEED
    }
    if (GAME_STATE.lowerAPressed) {
        GAME_STATE.playerX -= deltaTime*PLAYER_MAX_SPEED
    }

    //restricts player to the bounds of the game container
    GAME_STATE.playerX = clamp(
        GAME_STATE.playerX, 
        PLAYER_WIDTH, 
        GAME_WIDTH - PLAYER_WIDTH)

     //create the laser at the player's current position
    if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
        createLaser($gameContainer, GAME_STATE.playerX, GAME_STATE.playerY)
        GAME_STATE.playerCooldown = LASER_COOLDOWN
    }

    //decrement (reset) cooldown
    if (GAME_STATE.playerCooldown > 0) {
        GAME_STATE.playerCooldown -= deltaTime
    }
        
    const $player = document.querySelector('.player')
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY)
}

function createLaser($container, x, y) {
    const $element = document.createElement('img')
    $element.src = 'assets/images/laser/Zoltraak.png'
    $element.className = 'laser'
    $container.appendChild($element)
    /*abstraction of laser, pushed to game state
    to allow easily changing positions of all lasers*/
    const laser = { x, y, $element }
    GAME_STATE.lasers.push(laser)
    setPosition($element, x, y)
    const audio = new Audio('assets/sounds/Zoltraak.mp3')
    audio.play()
}

function updateLasers(deltaTime, $container) {
    const lasers = GAME_STATE.lasers
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i]
      //lasers go from bottom to top, therefore we subtract from their position
      laser.y -= deltaTime * LASER_MAX_SPEED
      if (laser.y < 0) {
        //removing laser from the game state when it's about to leave bounds
        destroyLaser($container, laser)
      }
      setPosition(laser.$element, laser.x, laser.y)
      const r1 = laser.$element.getBoundingClientRect();
      const enemies = GAME_STATE.enemies
      //looping through all enemies and lasers to check for collisions
      for (let j = 0; j < enemies.length; j++) {
        const enemy = enemies[j]
        if (enemy.isDead) continue
        const r2 = enemy.$element.getBoundingClientRect()
        if (rectsIntersect(r1, r2)) {
            // Enemy was hit
            //display winner screen when true
            destroyEnemy($container, enemy)
            destroyLaser($container, laser)
            //breaks out of the loop since no laser can hit more than one enemy
            break
        }
      }
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead)
  }

function destroyLaser($container, laser) {
    $container.removeChild(laser.$element)
    laser.isDead = true;
}

function createEnemy($container, x, y) {
    const $element = document.createElement('img')
    $element.src = 'assets/images/enemy/Qual.png'
    $element.className = 'enemy'
    $container.appendChild($element)
    const enemy = { 
        x, 
        y, 
        cooldown: rand(0.5, ENEMY_COOLDOWN), 
        $element 
    }
    GAME_STATE.enemies.push(enemy)
    setPosition($element, x, y)
}

function updateEnemies(deltaTime, $container) {
    //sine and cosine functions to create a wave-like movement
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

    const enemies = GAME_STATE.enemies
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i]
        const x = enemy.x + dx
        const y = enemy.y + dy
        setPosition(enemy.$element, x, y);
        enemy.cooldown -= deltaTime;
        if (enemy.cooldown <= 0) {
            createEnemyLaser($container, x, y);
            enemy.cooldown = ENEMY_COOLDOWN;
        }
    }
    GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);
}

function destroyEnemy($container, enemy) {
    $container.removeChild(enemy.$element)
    enemy.isDead = true
    score += 20;
    $score.innerHTML = score;
}

/*enemy laser functions, among others in the roject, are almost 
identical to the others, as they share many properties and behaviors. 
this would be a good implementation of javascript classes in the future.*/
function createEnemyLaser($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "assets/images/laser/Zoltraak.png";
    $element.className = "enemy-laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.enemyLasers.push(laser);
    setPosition($element, x, y);
}
  
function updateEnemyLasers(deltaTime, $container) {
    const lasers = GAME_STATE.enemyLasers;
    for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        //enemy lasers move towards the bottom of the container
        laser.y += deltaTime * LASER_MAX_SPEED;
        if (laser.y > GAME_HEIGHT) {
            destroyLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
        const r1 = laser.$element.getBoundingClientRect();
        const player = document.querySelector(".player");
        const r2 = player.getBoundingClientRect();
        if (rectsIntersect(r1, r2)) {
            // Player was hit
            destroyPlayer($container, player)
            destroyLaser($container, laser)
            break
        }
    }
    GAME_STATE.enemyLasers = GAME_STATE.enemyLasers.filter(e => !e.isDead);
}

//creates necessary elements for the game
function init () {
    //declaring and initializing the 'frame' of the game
    //dollar sign refers to DOM element (convention)
    createPlayer($gameContainer)
    $score.innerHTML = score;
    $lives.innerHTML = lives;

    const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1)
    for (let j = 0; j < 3; j++) {
        const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING
        for (let i = 0; i < ENEMIES_PER_ROW; i++) {
            const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING
            createEnemy($gameContainer, x, y)
        }
    }
}

function playerHasWon() {
    return GAME_STATE.enemies.length === 0;
}

function update() {
    if(!isRunning)
    return
    /*the rate at which requestAnimationFrame returns something is proportionate
    to the refresh rate of the screen, resulting in variable player speeds
    we counteract this by calculating how much time has elapsed since the last
    update was made, and using this relative value, called delta time to dictate the speed of the player*/
    const currentTime = Date.now()
    const deltaTime = (currentTime - GAME_STATE.lastTime) / 1000 //converting milliseconds to seconds

    if ($score.innerHTML !== String(score)) {
        $score.innerHTML = score;
    }

    if ($lives.innerHTML !== String(lives)) {
        $lives.innerHTML = lives;
    }   

    if (GAME_STATE.gamePaused) {
        stop()
        document.querySelector(".game-paused").style.display = "block"
        window.requestAnimationFrame(update)
    }

    if (playerHasWon()) {
        document.querySelector(".congratulations").style.display = "block"
        return
    }

    //display game over screen when true
    if (GAME_STATE.gameOver) {
        // lives -= 1;
        // $lives.innerHTML = lives;    
        document.querySelector(".game-over").style.display = "block"
        return
    }

    updatePlayer(deltaTime, $gameContainer)
    updateLasers(deltaTime, $gameContainer)
    updateEnemies(deltaTime, $gameContainer)
    updateEnemyLasers(deltaTime, $gameContainer)


    //updating current time after the update function is called
    GAME_STATE.lastTime = currentTime
    window.requestAnimationFrame(update)
}

function start(){
    document.querySelector(".game-paused").style.display = "none"
    isRunning = true
    GAME_STATE.gamePaused = false
    window.requestAnimationFrame(update)
}
  
function stop(){
    isRunning = false
}

function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowRight':
            GAME_STATE.rightArrowPressed = true
            break
        case 'ArrowLeft':
            GAME_STATE.leftArrowPressed = true
            break
        case 'a':
            GAME_STATE.lowerAPressed = true
            break
        case 'd':
            GAME_STATE.lowerDPressed = true
            break
        case ' ':
            GAME_STATE.spacePressed = true
            break
        case 'p':
            GAME_STATE.gamePaused = true
            break
    }
}

function onKeyUp(e) {
    switch (e.key) {
        case 'ArrowRight':
            GAME_STATE.rightArrowPressed = false
            break
        case 'ArrowLeft':
            GAME_STATE.leftArrowPressed = false
            break
        case 'a':
            GAME_STATE.lowerAPressed = false
            break
        case 'd':
            GAME_STATE.lowerDPressed = false
            break
        case ' ':
            GAME_STATE.spacePressed = false
            break
    }
}

init()
window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
window.requestAnimationFrame(update)
