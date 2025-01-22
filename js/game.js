//global variable for game container
const $gameContainer = document.querySelector('.game')

const GAME_WIDTH = 800
const GAME_HEIGHT = 600

const PLAYER_WIDTH = 60

//stores everything happening in the game at any given time
const GAME_STATE = {
    playerX: 0,
    playerY: 0,
}

function setPosition($el, x, y) {
    $el.style.transform = `translate(${x}px, ${y}px)`
}

function createPlayer($container) {
    /*setting the player's X and Y properties to the middle using
    CSS helps here, as it's not necessary to compensate for the usual off-set!*/

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


/*this approach depends on the rate at which keydown receives
input, which is tied to the typematic rate keyboard setting of the operating system.
this is why movement is janky and delayed. upon further research, a possible culprit could be
Windows' key-repeat feature.*/
function onKeyDown(e) {
    if (e.key === 'ArrowLeft') {
         GAME_STATE.playerX -= 5;
         const $player = document.querySelector(".player");
         setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
    } else if (e.key === 'ArrowRight') {
        GAME_STATE.playerX += 5;
        const $player = document.querySelector(".player");
        setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
    } else if (e.key === 'a') {
        GAME_STATE.playerX -= 5;
        const $player = document.querySelector(".player");
        setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
   } else if (e.key === 'd') {
       GAME_STATE.playerX += 5;
       const $player = document.querySelector(".player");
       setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
   }
}

//creates necessary elements for the game
function init () {
    //declaring and initializing the 'frame' of the game
    //dollar sign refers to DOM element (convention)
    createPlayer($gameContainer)
}

init();

window.addEventListener('keydown', onKeyDown);