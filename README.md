# Make-your-game

This project is our take on the classic arcade game Space Invaders

## Features
- Custome assets made by yours truly
- Use of a game loop to track inputs, update elements on screen accordingly,
check for collisions, and change game state when necessary
- Collision detection using getBoundingClientRect()
- Use of sine and cosine functions to create wave-like enemy movement
- Use of delta time to facilitate smooth, consistent movement across different refresh rates

## Objectives
- Game runs consistently at at least 60 FPS at all times
- No big frame drops (50-60fps only)!
- Proper use of RequestAnimationFrame
- It is very hard to predict performances in JS. So measure performances to see if your code is fast. This will be tested!
- Pause menu, that includes:
    1. Continue
    2. Restart
- A score board that displays the following metrics:
    1. Countdown clock or Timer that will indicate the amount of time the player has until the game ends or the time that the game has been running
    2. Score that will display the current score (XP or points)
    3. Lives that shows the number of lives that the player has left
- The use of layers must be minimal but not zero in order to optimize the rendering performance.
- You must not use frameworks or canvas, the game must be implemented using plain JS/DOM and HTML only

## Instructions

- Animation must have consistent motion through achieving 60 FPS.

- In order to play the game, the player must only use the keyboard. 

- Controls must be smooth, in other words, players should not need to spam a key to take actions in the game. 
Instead, for example, if a key is kept pressed, the player must continue to do the relevant action until released.

- Motions triggered by a key must not jank or stutter.

- Pause menu should allow players to pause, restart, and continue the game whenever. Pausing should not cause frame drops.

## Getting Started

### Project Structure

```
assets/
├── images/
│   ├── background/
│   │   └── space.png
│   ├── enemy/
│   │   └── Qual.png
│   ├── example/
│   │   └── game.png
│   ├── laser/
│   │   ├── Zoltraak-smaller.png
│   │   └── Zoltraak.png
│   └── player/
│       └── Frieren.png
├── sounds/
│   └── Zoltraak.mp3
├── css/
│   └── main.css
└── js/
    └── game.js
index.html
LICENSE
README.md
```

### Prerequisites

- Any modern web browser

### Installation

1. Clone the repository:

    ```sh
    git clone https://learn.reboot01.com/git/malalawi/make-your-game.git
    cd make-your-game
    ```
2. Open the index.html file in your browser of choice

## Example Usage

1. Move a/d or left/right arrow keys to move left and right respectively
2. Press space to shoot lasers
3. Kill all enemies to win!

## Example Images

![Gameplay](./assets/example/game.png)


## Limitations

- Game is limited to browsers only
- Few game assets

## Future Improvements

- Ascore board to record various attempts and rank different players
- More enemy formations for variety and replayability
- Difficulty levels with varying enemy speeds and laser cooldowns
- A simple story to engage players

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

## Authors

- Abdulla Jaffar AlAsmawi
- Mohammed Waleed AlAlawi

## License

This project is licensed under the MIT License. See the [LICENSE.md](https://learn.reboot01.com/git/malalawi/make-your-game/src/branch/master/LICENSE) file for details.

