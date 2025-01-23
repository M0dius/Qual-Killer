// global variable for game container
const $gameContainer = document.querySelector('.game')

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

const PLAYER_WIDTH = 60
const PLAYER_MAX_SPEED = 600

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
}

function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px, ${y}px)`
}

function clamp(v, min, max) {
    /*if v is less than min, return min
    if v is greater than max, return max, else return v
    in ternary because it look fancy!*/
    return v < min ? min : v > max ? max : v
}

function createPlayer($container) {
    /*setting the player's X and Y properties to the middle using
    in CSS helps us here as we do not have to compensate for the usual off-set!*/

    //sets player position on the Y axis of the game container
    GAME_STATE.playerX = GAME_WIDTH / 2
    //sets player position on the X axis of the game container
    GAME_STATE.playerY = GAME_HEIGHT - 120
    
    //creating an image element for the player
    const $player = document.createElement('img')
    //image source
    $player.src = 'assets/images/player/Frieren.png'
    $player.className = 'player'
    $container.appendChild($player)
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY)
}

function updatePlayer(deltaTime) {
    /*although a switch-case statement is more appropriate here,
    it would allow the player to move in both directions at once*/
    if (GAME_STATE.rightArrowPressed) {
        GAME_STATE.playerX += deltaTime * PLAYER_MAX_SPEED
    }
    if (GAME_STATE.leftArrowPressed) {
        GAME_STATE.playerX -= deltaTime * PLAYER_MAX_SPEED
    }5
    if (GAME_STATE.lowerDPressed) {
        GAME_STATE.playerX += deltaTime * PLAYER_MAX_SPEED
    }
    if (GAME_STATE.lowerAPressed) {
        GAME_STATE.playerX -= deltaTime * PLAYER_MAX_SPEED
    }

    //restricts player to the bounds of the game container
    GAME_STATE.playerX = clamp(
        GAME_STATE.playerX, 
        20, 
        GAME_WIDTH - PLAYER_WIDTH)

    const $player = document.querySelector('.player')
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY)
}

//creates necessary elements for the game
function init () {
    //dollar sign refers to DOM element (convention)
    createPlayer($gameContainer)
}

function update() {
    /*the rate at which requestAnimationFrame returns something is proportionate
    to the refresh rate of the screen, resulting in variable player speeds.
    to counteract this, the amount of time elapsed since the last
    update was made is calculated, and the resulting relative value, called delta time, 
    is used to control the speed of the player and other sprites*/
    const currentTime = Date.now();
    const deltaTime = (currentTime - GAME_STATE.lastTime) / 1000;

    updatePlayer(deltaTime);

    //updating current time after the update function is called
    GAME_STATE.lastTime = currentTime
    window.requestAnimationFrame(update)
}

function onKeyDown(e) {
    // console.log(e)
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
    }
}

init()

window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
window.requestAnimationFrame(update)