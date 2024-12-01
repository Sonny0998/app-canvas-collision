const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
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

        this.dx = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Velocidad en X
        this.dy = (Math.random() > 0.5 ? 1 : -1) * this.speed; // Velocidad en Y
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

        // Actualizar la posición X
        this.posX += this.dx;
        // Cambiar la dirección si el círculo llega al borde del canvas en X
        if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Actualizar la posición Y
        this.posY += this.dy;
        // Cambiar la dirección si el círculo llega al borde del canvas en Y
        if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }
    }
}

// Crear un array para almacenar N círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (window_width - radius * 2) + radius;
        let y = Math.random() * (window_height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speed = Math.random() * 2 + 1; // Velocidad entre 1 y 3
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speed));
    }
}

// Función para detectar colisiones entre dos círculos
function detectCollision(circle1, circle2) {
    let dx = circle1.posX - circle2.posX;
    let dy = circle1.posY - circle2.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    return distance < circle1.radius + circle2.radius;
}

// Función para manejar las colisiones
function handleCollisions() {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (detectCollision(circles[i], circles[j])) {
                // Intercambiar las velocidades en caso de colisión
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

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
    circles.forEach(circle => {
        circle.update(ctx); // Actualizar cada círculo
    });
    handleCollisions(); // Detectar y manejar colisiones
    requestAnimationFrame(animate); // Repetir la animación
}

// Generar N círculos y comenzar la animación
generateCircles(30); // Puedes cambiar el número de círculos aquí
animate();