//global variable for game container
const $gameContainer = document.querySelector('.game')

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

const PLAYER_WIDTH = 60

//stores everything happening in the game at any given time
const GAME_STATE = {
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
    return v < min ? min : v > max ? max : v;
}

function createPlayer($container) {
    /*setting the player's X and Y properties to the middle using
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

function updatePlayer() {
    /*although a switch-case statement is more appropriate here,
    it would allow the player to move in both directions at once*/
    if (GAME_STATE.rightArrowPressed) {
        GAME_STATE.playerX += 5
    }
    if (GAME_STATE.leftArrowPressed) {
        GAME_STATE.playerX -= 5
    }5
    if (GAME_STATE.lowerDPressed) {
        GAME_STATE.playerX += 5
    }
    if (GAME_STATE.lowerAPressed) {
        GAME_STATE.playerX -= 5
    }

    //restricts player to the bounds of the game container
    GAME_STATE.playerX = clamp(
        GAME_STATE.playerX, 
        PLAYER_WIDTH, 
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
    updatePlayer()
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

init();

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.requestAnimationFrame(update);