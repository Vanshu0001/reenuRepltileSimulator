// Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Configurations
const NUM_BONES = 100;
const BONE_LENGTH = 15;
const FOLLOW_SPEED = 0.05;
const DAMPING = 0.98;

// Mouse tracking
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Bone Class
class Bone {
    constructor(x, y, length) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.length = length;
        this.angle = 0;
    }

    follow(targetX, targetY) {
        // Calculate the direction and angle to follow the target
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        this.angle = Math.atan2(dy, dx);

        // Update position based on velocity
        this.vx += dx * FOLLOW_SPEED;
        this.vy += dy * FOLLOW_SPEED;

        this.vx *= DAMPING;
        this.vy *= DAMPING;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        const nextX = this.x + Math.cos(this.angle) * this.length;
        const nextY = this.y + Math.sin(this.angle) * this.length;

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(nextX, nextY);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}

// Bone Chain (Skeleton)
class Reptile {
    constructor(numBones, boneLength) {
        this.bones = [];
        let x = canvas.width / 2;
        let y = canvas.height / 2;

        // Create bones, each following the previous one
        for (let i = 0; i < numBones; i++) {
            this.bones.push(new Bone(x, y, boneLength));
        }
    }

    update() {
        let prevX = mouseX;
        let prevY = mouseY;

        this.bones.forEach((bone) => {
            bone.follow(prevX, prevY);
            prevX = bone.x;
            prevY = bone.y;
        });
    }

    draw() {
        this.bones.forEach((bone) => {
            bone.draw();
        });
    }
}

// Initialize the Reptile
const reptile = new Reptile(NUM_BONES, BONE_LENGTH);

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw the reptile
    reptile.update();
    reptile.draw();

    // Loop the game
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
