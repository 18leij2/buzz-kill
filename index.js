// Initial canvas setup
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 360;
context.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.2;

// Classes
class Sprite {
    constructor({ inPosition, imageSource, scale = 1, frames = 1, curr = 0, framesElapsed = 0, framesHold = 15, offset = { x: 0, y: 0 } }) {
        this.position = inPosition;
        this.image = new Image();
        this.image.src = imageSource;
        this.scale = scale;
        this.frames = frames;
        this.curr = curr; 
        this.framesElapsed = framesElapsed;
        this.framesHold = framesHold;
        this.height = 640;
        this.width = 320;
        this.offset = offset;
    }

    sketch() {
        context.drawImage(
            this.image,
            (this.curr * this.image.width) / this.frames,
            0,
            this.image.width / this.frames,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y- this.offset.y, 
            (this.image.width / this.frames) * this.scale, 
            this.image.height * this.scale);
    }

    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.curr < this.frames - 1) {
                this.curr++;
            } else {
                this.curr = 0;
            }
        }
    }

    update() {
        this.sketch(); 
        this.animateFrames();
    }
}

class Player extends Sprite {
    constructor({ inPosition, inVelocity, color = "blue", imageSource, 
    scale = 1, frames = 1, curr, framesElapsed, framesHold, offset = { x: 0, y: 0 }, sprites }) {
        super({
            inPosition,
            imageSource,
            scale,
            frames,
            curr,
            framesElapsed,
            framesHold,
            offset 
        })
        this.velocity = inVelocity;
        this.height = 64;
        this.width = 32;
        this.color = color;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: offset,
            width: 100,
            height: 30
        }
        this.attacking = false;
        this.health = 100;
        this.offset = offset;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSource;
        }

        console.log(this.sprites);
    }

    // sketch() {
    //     context.fillStyle = this.color;
    //     // context.fillRect(this.position.x, this.position.y, 50, 150);
    //     context.fillRect(this.position.x, this.position.y, this.width, this.height);

    //     if (this.attacking) {
    //         context.fillStyle = "green";
    //         context.fillRect(this.attackBox.position.x, this.attackBox.position.y + 16, this.attackBox.width, this.attackBox.height);
    //     }
    // }

    update() {
        this.sketch();

        this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            //this.position.y = 296; 
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.switchSprite("attack");
        this.attacking = true;

        setTimeout(() => {
            this.attacking = false;
        }, 100)
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.attack.image && this.curr < this.sprites.attack.frames - 1) {
            return;
        }
        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.frames = this.sprites.idle.frames;
                    this.curr = 0;
                }
                break;
            case "run":
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.frames = this.sprites.run.frames;
                    this.curr = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image)
                this.image = this.sprites.jump.image;
                this.frames = this.sprites.jump.frames;
                this.curr = 0;
                break;
                case "attack":
                    if (this.image !== this.sprites.attack.image)
                    this.image = this.sprites.attack.image;
                    this.frames = this.sprites.attack.frames;
                    this.curr = 0;
                    break;
        }
    }
}

// Initialize objects
const background = new Sprite({
    inPosition: {
        x: 0,
        y:0
    },
    imageSource: './background/background_1.png',
    scale: 1,
    frames: 1
})

const titleScreen = new Sprite({
    inPosition: {
        x: 0,
        y:0
    },
    imageSource: './background/TitleScreen.png',
    scale: 1,
    frames: 1
})

const selectionScreen = new Sprite({
    inPosition: {
        x: 0,
        y:0
    },
    imageSource: './background/enemyScreen.png',
    scale: 1,
    frames: 1
})


const shop = new Sprite({
    inPosition: {
        x: 300,
        y: 232
    },
    imageSource: './characters/testsheetfight2.png',
    scale: 2,
    frames: 18
})

const playerOne = new Player({
    inPosition: {
        x: 0,
        y: 0
    },
    inVelocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y:0
    },
    imageSource: './characters/uga_idle.png',
    scale: 2,
    frames: 2,
    offset: {
        x: 8,
        y: 19
    },
    sprites: {
        idle: {
            imageSource: './characters/uga_idle.png',
            frames: 2
        },
        run: {
            imageSource: './characters/uga_run.png',
            frames: 7
        },
        jump: {
            imageSource: './characters/uga_jump.png',
            frames: 4
        },
        attack: {
            imageSource: './characters/uga_attack.png',
            frames: 4
        }
    }
});

const playerTwo = new Player({
    inPosition: {
        x: 400,
        y: 100
    },
    inVelocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -64,
        y:0
    },
    color: "red",
    imageSource: './characters/uga_idle_new.png',
    scale: 2,
    frames: 2,
    offset: {
        x: 8,
        y: 19
    },
    sprites: {
        idle: {
            imageSource: './characters/uga_idle_new.png',
            frames: 2
        },
        run: {
            imageSource: './characters/uga_run_new.png',
            frames: 7
        },
        jump: {
            imageSource: './characters/uga_jump_new.png',
            frames: 4
        },
        attack: {
            imageSource: './characters/uga_attack_new.png',
            frames: 4
        }
    }
});

// Base mechanic functions
const controlKeys = {
    d: {
        down: false
    },
    a: {
        down: false
    },
    w: {
        down: false
    },
    ArrowRight: {
        down: false
    },
    ArrowLeft: {
        down: false
    },
    ArrowUp: {
        down: false
    }
}

let lastKeyOne;
let lastKeyTwo;

function animLoop() {
    window.requestAnimationFrame(animLoop);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    titleScreen.update();
    selectionScreen.update();
    background.update();
    shop.update();
    playerOne.update();
    playerTwo.update();

    playerOne.velocity.x = 0;
    playerTwo.velocity.x = 0;

    if (controlKeys.d.down && lastKeyOne === 'd') {
        playerOne.velocity.x = 3;
        playerOne.switchSprite("run");
    } else if (controlKeys.a.down && lastKeyOne === 'a') {
        playerOne.velocity.x = -3;
        playerOne.switchSprite("run");
    } else {
        playerOne.switchSprite("idle");
    }

    if (attackCollision({ attacker: playerOne, opponent: playerTwo}) && playerOne.attacking) {
        playerOne.attacking = false;
        playerTwo.health -= 10;
        document.querySelector('#playerTwoHealth').style.width = playerTwo.health + "%";
    }

    if (playerOne.velocity.y < 0) {
        playerOne.switchSprite("jump");
    }

    if (controlKeys.ArrowRight.down && lastKeyTwo === 'ArrowRight') {
        playerTwo.velocity.x = 3;
        playerTwo.switchSprite("run");
    } else if (controlKeys.ArrowLeft.down && lastKeyTwo === 'ArrowLeft') {
        playerTwo.velocity.x = -3;
        playerTwo.switchSprite("run");
    } else {
        playerTwo.switchSprite("idle");
    }

    if (attackCollision({ attacker: playerTwo, opponent: playerOne}) && playerTwo.attacking) {
        playerTwo.attacking = false;
        playerOne.health -= 10;
        document.querySelector('#playerOneHealth').style.width = playerOne.health + "%";
    }

    if (playerTwo.velocity.y < 0) {
        playerTwo.switchSprite("jump");
    }

    if (playerOne.health <= 0 || playerTwo.health <= 0) {
        calculateWinner({ playerOne, playerTwo, timerId });
    }
}

animLoop();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            controlKeys.d.down = true;
            lastKeyOne = 'd';
            break;
        case 'a':
            controlKeys.a.down = true;
            lastKeyOne = 'a';
            break;
        case 'w':
            playerOne.velocity.y = -5;
            break;
        case 'v':
            playerOne.attack();
            break;
        case 'ArrowRight':
            controlKeys.ArrowRight.down = true;
            lastKeyTwo = 'ArrowRight';
            break;
        case 'ArrowLeft':
            controlKeys.ArrowLeft.down = true;
            lastKeyTwo = 'ArrowLeft';
            break;
        case 'ArrowUp':
            playerTwo.velocity.y = -5;
            break;
        case '.':
            playerTwo.attack();
            break;
    }
    console.log(event.key);
})

window.addEventListener('keyup', (event ) => {
    switch (event.key) {
        case 'd':
            controlKeys.d.down = false;
            break;
        case 'a':
            controlKeys.a.down = false;
            break;
        case 'w':
            controlKeys.w.down = false;
            break;
        case 'ArrowRight':
            controlKeys.ArrowRight.down = false;
            break;
        case 'ArrowLeft':
            controlKeys.ArrowLeft.down = false;
            break;
        case 'ArrowUp':
            controlKeys.ArrowUp.down = false;
            break;
    }
})

// Utility functions
function attackCollision({ attacker, opponent }) {
    return (
        attacker.attackBox.position.x + attacker.attackBox.width >= opponent.position.x &&
        attacker.attackBox.position.x <= opponent.position.x + opponent.width &&
        attacker.attackBox.position.y + attacker.attackBox.height >= opponent.position.y &&
        attacker.attackBox.position.y <= opponent.position.y + opponent.height
    )
}

function calculateWinner({ playerOne, playerTwo, timerId }) {
    clearTimeout(timerId);
    document.querySelector("#textEnd").style.display = "flex";
    if (playerOne.health === playerTwo.health && timer === 0) {
        document.querySelector("#textEnd").innerHTML = "Tie"; 
    } else if (playerOne.health > playerTwo.health) {
        document.querySelector("#textEnd").innerHTML = "Player One Wins";
    } else if (playerTwo.health > playerOne.health) {
        document.querySelector("#textEnd").innerHTML = "Player Two Wins";
    }
}

let timer = 60;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector("#timer").innerHTML = timer
    }

    if (timer === 0) {
        calculateWinner({ playerOne, playerTwo }); 
    }
    
}
decreaseTimer();