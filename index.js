const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// canvas.width = 1024;
// canvas.height = 576;
//test :)
canvas.width = 640;
canvas.height = 360;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

// const background = new Sprite({
//     position: {
//       x: 0,
//       y: 0
//     },
//     imageSrc: './background/background_1.png'
// })


class Sprite {
    constructor({ inPosition, inVelocity, color = "blue", offset }) {
        this.position = inPosition;
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
    }

    sketch() {
        context.fillStyle = this.color;
        // context.fillRect(this.position.x, this.position.y, 50, 150);
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        if (this.attacking) {
            context.fillStyle = "green";
            context.fillRect(this.attackBox.position.x, this.attackBox.position.y + 16, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.sketch();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.attacking = true;

        setTimeout(() => {
            this.attacking = false;
        }, 100)
    }
}

const playerOne = new Sprite({
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
    }
});

const playerTwo = new Sprite({
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
    color: "red"
});

console.log(playerOne);
console.log(playerTwo);

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

function attackCollision({ attacker, opponent }) {
    return (
        attacker.attackBox.position.x + attacker.attackBox.width >= opponent.position.x &&
        attacker.attackBox.position.x <= opponent.position.x + opponent.width &&
        attacker.attackBox.position.y + attacker.attackBox.height >= opponent.position.y &&
        attacker.attackBox.position.y <= opponent.position.y + opponent.height
    )
}

function animLoop() {
    window.requestAnimationFrame(animLoop);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    //background.update();
    playerOne.update();
    playerTwo.update();

    playerOne.velocity.x = 0;
    playerTwo.velocity.x = 0;

    if (controlKeys.d.down && lastKeyOne === 'd') {
        playerOne.velocity.x = 3;
    } else if (controlKeys.a.down && lastKeyOne === 'a') {
        playerOne.velocity.x = -3;
    } 

    if (attackCollision({ attacker: playerOne, opponent: playerTwo}) && playerOne.attacking) {
        playerOne.attacking = false;
        console.log("yeehaw")
    }

    if (controlKeys.ArrowRight.down && lastKeyTwo === 'ArrowRight') {
        playerTwo.velocity.x = 3;
    } else if (controlKeys.ArrowLeft.down && lastKeyTwo === 'ArrowLeft') {
        playerTwo.velocity.x = -3;
    }

    if (attackCollision({ attacker: playerTwo, opponent: playerOne}) && playerTwo.attacking) {
        playerTwo.attacking = false;
        console.log("waheey")
    }
}

animLoop();

window.addEventListener('keydown', (event ) => {
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