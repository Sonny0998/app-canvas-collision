const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;
canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;

        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed; 
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed; 
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        this.posY -= this.dy;  // Movimiento hacia arriba

        // Reaparecer cuando llega al borde superior
        if (this.posY - this.radius < 0) {
            this.posY = window_height + this.radius;
        }
    }
}

let circles = [];

function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = window_height + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speed = Math.random() * 2 + 1;
        let text = `C${i + 1}`;
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Detectar colisión entre dos círculos
function detectCollision(circle1, circle2) {
    let dx = circle1.posX - circle2.posX;
    let dy = circle1.posY - circle2.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle1.radius + circle2.radius;
}

// Manejar las colisiones
function handleCollisions() {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (detectCollision(circles[i], circles[j])) {
                let tempDx = circles[i].dx;
                let tempDy = circles[i].dy;

                circles[i].dx = circles[j].dx;
                circles[i].dy = circles[j].dy;

                circles[j].dx = tempDx;
                circles[j].dy = tempDy;
            }
        }
    }
}

// Detectar clic en el canvas
canvas.addEventListener("click", (e) => {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    circles = circles.filter(circle => {
        let dx = mouseX - circle.posX;
        let dy = mouseY - circle.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance > circle.radius;  // Eliminar círculos cerca del clic
    });
});

// Animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    circles.forEach(circle => circle.update(ctx));
    handleCollisions();
    requestAnimationFrame(animate);
}

generateCircles(30);
animate();
