// game.ts

// Definimos las interfaces para los elementos del juego
interface Paddle {
  width: number;
  height: number;
  x: number;
  y: number;
  dy: number;  // Velocidad de movimiento de la paleta
}

interface Ball {
  radius: number;
  x: number;
  y: number;
  dx: number;  // Velocidad de la pelota en el eje X
  dy: number;  // Velocidad de la pelota en el eje Y
}

// Definir variables globales para el canvas y los elementos del juego
const canvas = document.getElementById("pongCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let leftPaddle: Paddle;
let rightPaddle: Paddle;
let ball: Ball;
let animation: number;
let player1Score: number = 0;
let player2Score: number = 0;

// Inicializar las variables del juego
function initializeGame() {
  leftPaddle = {
      width: paddleWidth,
      height: paddleHeight,
      x: 0,
      y: canvas.height / 2 - paddleHeight / 2,
      dy: 0,
  };

  rightPaddle = {
      width: paddleWidth,
      height: paddleHeight,
      x: canvas.width - paddleWidth,
      y: canvas.height / 2 - paddleHeight / 2,
      dy: 0,
  };

  ball = {
      radius: ballRadius,
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: 8,
      dy: 8,
  };

  gameLoop(); // Comienza el juego
}

// Dibuja las paletas y la pelota en el canvas
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

  // Dibujar marcadores
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(player1Score.toString(), canvas.width / 4, 50);
  ctx.fillText(player2Score.toString(), (canvas.width / 4) * 3, 50);

  // Dibuja la paleta izquierda
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);

  // Dibuja la paleta derecha
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Dibuja la pelota
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.closePath();
}

// Lógica para mover las palas y la pelota
function moveGameObjects() {
  // Mover las palas
  
  updatePaddlePositions();

  // Mover la pelota
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Colisiones con las paredes superior e inferior
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy = -ball.dy; // Invertir dirección de la pelota en el eje Y
  }

  // Colisiones con las palas
  const paddleCollisionMargin = 5; // Ajuste para mejorar la detección de colisiones

if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width + paddleCollisionMargin && 
    ball.x - ball.radius > leftPaddle.x - paddleCollisionMargin &&
    ball.y > leftPaddle.y - paddleCollisionMargin && ball.y < leftPaddle.y + leftPaddle.height + paddleCollisionMargin) {
    ball.dx = -ball.dx; // Invertir dirección de la pelota en el eje X
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius; // Ajustar posición de la pelota
}

if (ball.x + ball.radius > rightPaddle.x - paddleCollisionMargin && 
    ball.x + ball.radius < rightPaddle.x + rightPaddle.width + paddleCollisionMargin &&
    ball.y > rightPaddle.y - paddleCollisionMargin && ball.y < rightPaddle.y + rightPaddle.height + paddleCollisionMargin) {
    ball.dx = -ball.dx; // Invertir dirección de la pelota en el eje X
    ball.x = rightPaddle.x - ball.radius; // Ajustar posición de la pelota
}

  // Si la pelota se sale por la izquierda o derecha (final de juego)
  if (ball.x - ball.radius < 0 ) {
      player2Score++;
      resetBall(); // Resetea la posición de la pelota
  }else if(ball.x + ball.radius > canvas.width){
      player1Score++;
      resetBall(); // Resetea la posición de la pelota
  }
}

// Resetea la pelota al centro
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx; // Invertir la dirección inicial
}

function resetAll(){
  resetBall();
  leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
  rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
  player1Score = 0;
  player2Score = 0;
}

function updatePaddlePositions() {
  // Actualizar posición de la paleta derecha
  rightPaddle.y += rightPaddle.dy;
  if (rightPaddle.y < 0) {
      rightPaddle.y = 0;
  } else if (rightPaddle.y > canvas.height - rightPaddle.height) {
      rightPaddle.y = canvas.height - rightPaddle.height;
  }

  // Actualizar posición de la paleta izquierda
  leftPaddle.y += leftPaddle.dy;
  if (leftPaddle.y < 0) {
      leftPaddle.y = 0;
  } else if (leftPaddle.y > canvas.height - leftPaddle.height) {
      leftPaddle.y = canvas.height - leftPaddle.height;
  }
}


// Bucle principal del juego
function gameLoop() {
  drawGame();
  moveGameObjects();
  animation = requestAnimationFrame(gameLoop); // Llama a gameLoop para crear el bucle del juego
}


// Iniciar el juego
initializeGame();
