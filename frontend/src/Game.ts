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
// Nombres de los jugadores
let player1Name = "Player 1";
let player2Name = "Player 2";
const winnerScore = 5; // Puntuación para ganar el juego
let isTournament: boolean = false;
let isGameOver:boolean = false;

let winner: string = "";

let isGamePaused: boolean = true;
let newGame: boolean = true;

// Definir un factor de incremento para la velocidad de la pelota
const inicialBallSpeed = 6;
const speedIncrement = 0.01;

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
      dx: 6,
      dy: 6,
  };
  gameLoop(); // Comienza el juego
  cancelAnimationFrame(animation); // Pausa el juego
}

// Dibuja las paletas y la pelota en el canvas
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas


   // Dibujar los nombres de los jugadores
   ctx.font = "20px 'Press Start 2P', cursive";
   ctx.fillStyle = "white";
   ctx.textAlign = "center";
   ctx.fillText(player1Name, canvas.width / 4, 35); // Posición del nombre del jugador 1
   ctx.fillText(player2Name, (canvas.width / 4) * 3, 35); // Posición del nombre del jugador 2
  // Dibujar marcadores
  ctx.font = "25px 'Press Start 2P', cursive";
  ctx.fillStyle = "white";
  ctx.fillText(player1Score.toString(), canvas.width / 4, 80);
  ctx.fillText(player2Score.toString(), (canvas.width / 4) * 3, 80);

  // Dibuja la paleta izquierda
  ctx.fillStyle = "#BE36CD";
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

  // Incrementar la velocidad de la pelota
  ball.dx += ball.dx > 0 ? speedIncrement : -speedIncrement;

  // Mover la pelota
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Colisiones con las paredes superior e inferior
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.dy = -ball.dy; // Invertir dirección de la pelota en el eje Y
  }

  // Colisiones con las palas
  const paddleCollisionMargin = 6; // Ajuste para mejorar la detección de colisiones

  if (ball.x - ball.radius < leftPaddle.x + leftPaddle.width + paddleCollisionMargin && 
    ball.x - ball.radius > leftPaddle.x - paddleCollisionMargin &&
    ball.y > leftPaddle.y - paddleCollisionMargin && ball.y < leftPaddle.y + leftPaddle.height + paddleCollisionMargin) {
    ball.dx = -ball.dx; // Invertir dirección de la pelota en el eje X

    // Calcular la posición relativa del impacto en la paleta
    const impactPosition = (ball.y - leftPaddle.y) / leftPaddle.height;
    // Ajustar la velocidad vertical de la pelota
    ball.dy = 8 * (impactPosition - 0.5); // Ajustar el factor según sea necesario

    ball.x = leftPaddle.x + leftPaddle.width + ball.radius; // Ajustar posición de la pelota
}

if (ball.x + ball.radius > rightPaddle.x - paddleCollisionMargin && 
    ball.x + ball.radius < rightPaddle.x + rightPaddle.width + paddleCollisionMargin &&
    ball.y > rightPaddle.y - paddleCollisionMargin && ball.y < rightPaddle.y + rightPaddle.height + paddleCollisionMargin) {
    ball.dx = -ball.dx; // Invertir dirección de la pelota en el eje X

    // Calcular la posición relativa del impacto en la paleta
    const impactPosition = (ball.y - rightPaddle.y) / rightPaddle.height;
    // Ajustar la velocidad vertical de la pelota
    ball.dy = 8 * (impactPosition - 0.5); // Ajustar el factor según sea necesario

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
  if(player1Score === winnerScore || player2Score === winnerScore){
    isGameOver = true;
    cancelAnimationFrame(animation); // Detener el bucle del juego
    showGameResult(); // Mostrar el resultado del juego
  }
}

function showGameResult() {
  isGamePaused = true;
  winner = player1Score > player2Score ? player1Name : player2Name;
  let resultText = winner + " wins!";

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
  ctx.font = "48px 'Press Start 2P', cursive";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(resultText, canvas.width / 2, canvas.height / 2);
  ctx.font = "24px 'Press Start 2P', cursive";
  ctx.fillText(player1Score + " - " + player2Score, canvas.width / 2, canvas.height / 2 + 50);
  ctx.font = "16px 'Press Start 2P', cursive";
  if(isTournament){
    resetGameBtn.innerText = "Volver al Torneo";
    startGameBtn.style.display = "none";
  }else{
    resetGameBtn.innerText = "Reiniciar Juego";
    startGameBtn.style.display = "none";
  }
}

// Función para mostrar la cuenta atrás
function showCountdown(callback: () => void) {
  let countdown = 3;

  // Desactivar el botón de reinicio y inicio del juego
  startGameBtn.disabled = true;
  resetGameBtn.disabled = true;

  // Función para dibujar el número de la cuenta atrás
  const drawCountdown = () => {
      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dibujar el número de la cuenta atrás
      ctx.font = "48px 'Press Start 2P', cursive";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
  };

  // Dibujar el primer número inmediatamente
  drawCountdown();

  const countdownInterval = setInterval(() => {
      countdown--;
      if (countdown < 0) {
          clearInterval(countdownInterval);
          startGameBtn.disabled = false; // Reactivar el botón de inicio del juego
          resetGameBtn.disabled = false; // Reactivar el botón de reinicio
          callback(); // Llamar a la función de inicio del juego
      } else {
          drawCountdown();
      }
  }, 1000);
}


// Resetea la pelota al centro
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = ball.dx < 0 ? inicialBallSpeed : -inicialBallSpeed; // Restablecer la velocidad de la pelota
  ball.dy = inicialBallSpeed;
}

function resetAll(){
  resetBall();
  isGameOver = false;
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


function resetButtonLogic(){
      resetGameBtn.innerText = "Reiniciar Juego";
      resetAll(); // Resetea el juego
      isGamePaused = true;
      newGame = true;
      cancelAnimationFrame(animation); // Pausar el juego
      drawGame();
      startGameBtn.innerText = "Iniciar Juego";
      startGameBtn.style.display = "block";
}

// Bucle principal del juego
function gameLoop() {
    if (isGamePaused) {
      return;
    }
    isGameOver = false;
    drawGame();
    moveGameObjects();
    animation = requestAnimationFrame(gameLoop); // Llama a gameLoop para crear el bucle del juego
}


// Iniciar el juego
initializeGame();
