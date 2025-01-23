//global variable for game container
const $gameContainer = document.querySelector('.game')

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

const PLAYER_WIDTH = 60
//all speeds are in pixles/s
const PLAYER_MAX_SPEED = 300
const LASER_MAX_SPEED = 300
const LASER_COOLDOWN = 0.5

const ENEMIES_PER_ROW = 10
const ENEMY_HORIZONTAL_PADDING = 80
const ENEMY_VERTICAL_PADDING = 70
const ENEMY_VERTICAL_SPACING = 80

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
    enemies: []
}

function rectsIntersect(r1, r2) {
    /*if these conditions are met, the hitboxes are intersecting
    not!*/
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

function updateLasers(deltaTime, $container) {
    const lasers = GAME_STATE.lasers
    for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i]
        //lasers go from bottom to top, therefore we subtract from their position
        laser.y -= deltaTime*LASER_MAX_SPEED
        if (laser.y < 0) {
            //removing laser from the game state
            destroyLaser($container, laser)
        }
        setPosition(laser.$element, laser.x, laser.y)
        //returns the boundary required for hitbox detection
        const r1 = laser.$element.getBoundingClientRect()
        console.log('Laser Rect:', laserRect) // Debugging
        const enemies = GAME_STATE.enemies
        //loop through 
        for (let j = 0; j <lasers.length; j++) {
            const enemy = enemies[j]
            if (enemy.isDead) continue
             const r2 = enemy.$element.getBoundingClientRect()
             console.log('Laser Rect:', laserRect) // Debugging
            if (rectsIntersect(r1, r2)) {
                /*destroy enemy and laser on collision*/
                destroyEnemy($container, enemy)
                destroyLaser($container, laser)
                //breaks out of the loop since no laser can hit more than one enemy
                break
            }
        }
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead)
}

function updateLasers(dt, $container) {
    const lasers = GAME_STATE.lasers
    for (let i = 0; i < lasers.length; i++) {
      const laser = lasers[i]
      //lasers go from bottom to top, therefore we subtract from their position
      laser.y -= dt * LASER_MAX_SPEED
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
    const enemy = { x, y, $element }
    GAME_STATE.enemies.push(enemy)
    setPosition($element, x, y)
}

function updateEnemies() {
    //sine and cosine functions to create a wave-like movement
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
  const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 10;

  const enemies = GAME_STATE.enemies
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i]
    const x = enemy.x + dx
    const y = enemy.y + dy
    setPosition(enemy.$element, x, y);
  }
  GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);
}

function destroyEnemy($container, enemy) {
    $container.removeChild(enemy.$element)
    enemy.isDead = true
}

//creates necessary elements for the game
function init () {
    //declaring and initializing the 'frame' of the game
    //dollar sign refers to DOM element (convention)
    createPlayer($gameContainer)

    const enemySpacing = (GAME_WIDTH - ENEMY_HORIZONTAL_PADDING * 2) / (ENEMIES_PER_ROW - 1)
    for (let j = 0; j < 3; j++) {
      const y = ENEMY_VERTICAL_PADDING + j * ENEMY_VERTICAL_SPACING
      for (let i = 0; i < ENEMIES_PER_ROW; i++) {
        const x = i * enemySpacing + ENEMY_HORIZONTAL_PADDING
        createEnemy($gameContainer, x, y)
      }
    }
}

function update() {
    /*the rate at which requestAnimationFrame returns something is proportionate
    to the refresh rate of the screen, resulting in variable player speeds
    we counteract this by calculating how much time has elapsed since the last
    update was made, and using this relative value, called delta time to dictate the speed of the player*/
    const currentTime = Date.now()
    const deltaTime = (currentTime - GAME_STATE.lastTime) / 1000 //converting milliseconds to seconds

    updatePlayer(deltaTime, $gameContainer)
    updateLasers(deltaTime, $gameContainer)
    updateEnemies(deltaTime, $gameContainer)


    //updating current time after the update function is called
    GAME_STATE.lastTime = currentTime
    window.requestAnimationFrame(update)
}

function onKeyDown(e) {
    console.log(e)
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
    }
}

function onKeyUp(e) {
    // console.log(e.keyCode)
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
