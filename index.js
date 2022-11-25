const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// canvas.width = 1024;
// canvas.height = 576;
canvas.width = 640;
canvas.height = 360;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.08;

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

function animLoop() {
    window.requestAnimationFrame(animLoop);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    playerOne.update();
    playerTwo.update();
}

animLoop();