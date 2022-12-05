// Initial canvas setup
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 360;
context.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.2;
let isCroc = false;
let isMenu = true;
let isSelect = true;
let isStart = false;
let buffer = true;
document.getElementById("uiElement").style.visibility = "hidden";

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
            this.position.y - this.offset.y, 
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
    scale = 1, frames = 1, curr, framesElapsed, framesHold, offset = { x: 0, y: 0 }, sprites, 
    attackBox = { offset: {}, width: undefined, height: undefined } }) {
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
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.attacking = false;
        this.health = 100;
        this.offset = offset;
        this.sprites = sprites;
        this.dead = false;

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

        if (!this.dead) {
            this.animateFrames();
        }
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);

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
    }

    takeHit() {
        this.health -= 10;

        if (this.health <= 0) {
            this.switchSprite("death");
        } else {
            this.switchSprite("takeHit");
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.curr === this.sprites.death.frames - 1) {
                this.dead = true;
            }
            return;
        }

        if (this.image === this.sprites.attack.image && this.curr < this.sprites.attack.frames - 1) {
            return;
        }

        if (this.image === this.sprites.takeHit.image && this.curr < this.sprites.takeHit.frames - 1) {
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
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.frames = this.sprites.jump.frames;
                    this.curr = 0;
                }
                break;
            case "attack":
                if (this.image !== this.sprites.attack.image) {
                    this.image = this.sprites.attack.image;
                    this.frames = this.sprites.attack.frames;
                    this.curr = 0;
                }
                break;
            case "takeHit":
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.frames = this.sprites.takeHit.frames;
                    this.curr = 0;
                }
                break;
            case "death":
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.frames = this.sprites.death.frames;
                    this.curr = 0;
                }
                break;
        }
    }
}

// Initialize objects
var background = new Sprite({
    inPosition: {
        x: 0,
        y:0
    },
    imageSource: './background/background_1.png',
    scale: 1,
    frames: 1
});

var num = Math.floor(Math.random() * 3);

switch (num) {
    case 0:
        background = new Sprite({
            inPosition: {
                x: 0,
                y:0
            },
            imageSource: './background/background_1.png',
            scale: 1,
            frames: 1
        });
        break;
    case 1:
        background = new Sprite({
            inPosition: {
                x: 0,
                y:0
            },
            imageSource: './background/background_2.png',
            scale: 1,
            frames: 1
        });
        break;
    case 2:
        background = new Sprite({
            inPosition: {
                x: 0,
                y:0
            },
            imageSource: './background/background_3.png',
            scale: 1,
            frames: 1
        });
        break;
}
console.log(num)
console.log(background.imageSource)

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
    imageSource: './characters/buzz/buzz_idle.png',
    scale: 1.25,
    frames: 2,
    offset: {
        x: 0,
        y: 16
    },
    framesHold: 15,
    sprites: {
        idle: {
            imageSource: './characters/buzz/buzz_idle.png',
            frames: 2
        },
        run: {
            imageSource: './characters/buzz/buzz_run.png',
            frames: 4
        },
        jump: {
            imageSource: './characters/buzz/buzz_jump.png',
            frames: 5
        },
        attack: {
            imageSource: './characters/buzz/buzz_attack.png',
            frames: 4
        },
        takeHit: {
            imageSource: './characters/buzz/buzz_hit.png',
            frames: 4
        },
        death: {
            imageSource: './characters/buzz/buzz_death.png',
            frames: 4
        }
    },
    attackBox: {
        offset: {
            x: 51,
            y: 10, 
        },
        width: 45,
        height: 32
    }
});

var playerTwo = new Player({
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
    scale: 1.75,
    frames: 2,
    offset: {
        x: 8,
        y: 8
    },
    framesHold: 20,
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
        },
        takeHit: {
            imageSource: './characters/uga_hit.png',
            frames: 4
        },
        death: {
            imageSource: './characters/uga_death.png',
            frames: 8
        }
    },
    attackBox: {
        offset: {
            x: -3,
            y: 10, 
        },
        width: 35,
        height: 32
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

function updatePlayerTwo() {
    if (isCroc) {
        playerTwo = new Player({
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
            imageSource: './characters/Gator_idle.png',
            scale: 1.25,
            frames: 2,
            offset: {
                x: 40,
                y: 21
            },
            framesHold: 20,
            sprites: {
                idle: {
                    imageSource: './characters/Gator_idle.png',
                    frames: 2
                },
                run: {
                    imageSource: './characters/Gator_walk.png',
                    frames: 6
                },
                jump: {
                    imageSource: './characters/Gator_jump.png',
                    frames: 4
                },
                attack: {
                    imageSource: './characters/Gator_attack.png',
                    frames: 4
                },
                takeHit: {
                    imageSource: './characters/Gator_hit.png',
                    frames: 4
                },
                death: {
                    imageSource: './characters/Gator_jump.png', // PLACEHOLDER ANIMATION
                    frames: 4
                }
            },
            attackBox: {
                offset: {
                    x: -28,
                    y: 0, 
                },
                width: 40,
                height: 32
            }
        });
    }
}

let lastKeyOne;
let lastKeyTwo;

function animLoop() {
    window.requestAnimationFrame(animLoop);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    // selectionScreen.update();
    background.update();
    
    // shop.update();
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (isMenu) {
        titleScreen.update();
    //} //else if (isSelect) {
        //selectionScreen.update();
    } else {
        isStart = true;
        playerOne.update();
        playerTwo.update();
    }
    
    playerOne.velocity.x = 0;
    playerTwo.velocity.x = 0;

    if (controlKeys.d.down && lastKeyOne === 'd') {
        playerOne.velocity.x = 3;
        if (playerOne.velocity.y >= 0) {
            playerOne.switchSprite("run");
        } 
    } else if (controlKeys.a.down && lastKeyOne === 'a') {
        playerOne.velocity.x = -3;
        if (playerOne.velocity.y >= 0) {
            playerOne.switchSprite("run");
        } 
    } else if (playerOne.velocity.y >= 0) {
        playerOne.switchSprite("idle");
    }

    if (attackCollision({ attacker: playerOne, opponent: playerTwo}) && playerOne.attacking && playerOne.curr === 2) {
        playerTwo.takeHit();
        playerOne.attacking = false;
        // document.querySelector('#playerTwoHealth').style.width = playerTwo.health + "%";
        gsap.to('#playerTwoHealth', {
            width: playerTwo.health + "%"
        });
    }

    if (playerOne.attacking && playerOne.curr === 2) {
        playerOne.attacking = false;
    }

    if (playerOne.velocity.y < 0) {
        playerOne.switchSprite("jump");
    }

    if (controlKeys.ArrowRight.down && lastKeyTwo === 'ArrowRight') {
        playerTwo.velocity.x = 3;
        if (playerTwo.velocity.y >= 0) {
            playerTwo.switchSprite("run");
        } 
    } else if (controlKeys.ArrowLeft.down && lastKeyTwo === 'ArrowLeft') {
        playerTwo.velocity.x = -3;
        if (playerTwo.velocity.y >= 0) {
            playerTwo.switchSprite("run");
        } 
    } else if (playerTwo.velocity.y >= 0){
        playerTwo.switchSprite("idle");
    }

    if (attackCollision({ attacker: playerTwo, opponent: playerOne}) && playerTwo.attacking && playerTwo.curr === 2) {
        playerOne.takeHit();
        playerTwo.attacking = false;
        // document.querySelector('#playerOneHealth').style.width = playerOne.health + "%";
        gsap.to('#playerOneHealth', {
            width: playerOne.health + "%"
        });
    }

    if (playerTwo.attacking && playerTwo.curr === 2) {
        playerTwo.attacking = false;
    }

    if (playerTwo.velocity.y < 0) {
        playerTwo.switchSprite("jump");
    }

    if (playerOne.health <= 0 || playerTwo.health <= 0) {
        calculateWinner({ playerOne, playerTwo, timerId });
    }

    if (isStart && buffer) {
        buffer = false;
        decreaseTimer();
    }
}
animLoop();

window.addEventListener('keydown', (event) => {
    if (!playerOne.dead) {
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
            case ' ':
                isMenu = false;
                break;
        }
    }
    
    console.log(event.key);

    if (!playerTwo.dead) {
        switch(event.key) {
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
    }

    switch(event.key) {
        case '1':
            if (!isMenu) {
                document.getElementById("uiElement").style.visibility = "visible";
                isSelect = false;
                isStart = true;
            }
            break;
        case '2':
            if (!isMenu) {
                document.getElementById("uiElement").style.visibility = "visible";
                isCroc = true;
                updatePlayerTwo();
                isSelect = false;
                isStart = true;
            }
            break;
    }
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
    if (attacker === playerOne) {
        return (
            attacker.attackBox.position.x + attacker.attackBox.width >= opponent.attackBox.position.x + opponent.attackBox.width &&
            attacker.attackBox.position.x <= opponent.position.x + opponent.width &&
            attacker.attackBox.position.y + attacker.attackBox.height >= opponent.position.y &&
            attacker.attackBox.position.y <= opponent.position.y + opponent.height
        )
    } else if (attacker === playerTwo) {
        return (
            attacker.attackBox.position.x <= opponent.attackBox.position.x &&
            attacker.attackBox.position.x >= opponent.position.x &&
            attacker.attackBox.position.y + attacker.attackBox.height >= opponent.position.y &&
            attacker.attackBox.position.y <= opponent.position.y + opponent.height
        )
    }
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
        document.querySelector("#timer").innerHTML = timer;
    }

    if (timer === 0) {
        calculateWinner({ playerOne, playerTwo }); 
    }
    
}
