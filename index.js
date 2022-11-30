const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// canvas.width = 1024;
// canvas.height = 576;
canvas.width = 640;
canvas.height = 360;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

class Sprite {
    constructor({ inPosition, inVelocity }) {
        this.position = inPosition;
        this.velocity = inVelocity;
        this.height = 64;
    }

    sketch() {
        context.fillStyle = "blue";
        // context.fillRect(this.position.x, this.position.y, 50, 150);
        context.fillRect(this.position.x, this.position.y, 32, this.height);
    }

    update() {
        this.sketch();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
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
    }
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

function animLoop() {
    window.requestAnimationFrame(animLoop);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    playerOne.update();
    playerTwo.update();

    playerOne.velocity.x = 0;
    playerTwo.velocity.x = 0;

    if (controlKeys.d.down && lastKeyOne === 'd') {
        playerOne.velocity.x = 3;
    } else if (controlKeys.a.down && lastKeyOne === 'a') {
        playerOne.velocity.x = -3;
    } 

    if (controlKeys.ArrowRight.down && lastKeyTwo === 'ArrowRight') {
        playerTwo.velocity.x = 3;
    } else if (controlKeys.ArrowLeft.down && lastKeyTwo === 'ArrowLeft') {
        playerTwo.velocity.x = -3;
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
    console.log(event.key);
})