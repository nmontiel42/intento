// gameLogic.ts



// Obtener los botones de control
const startGameBtn = document.getElementById("startGameBtn") as HTMLButtonElement;
const resetGameBtn = document.getElementById("resetGameBtn") as HTMLButtonElement;


// Lógica para manejar la entrada del teclado (movimiento de las palas)
document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowUp") {
        if(rightPaddle.y > 0){ 
            rightPaddle.dy = -5; // Mueve la paleta derecha hacia arriba
        }else{
            rightPaddle.dy = 0;
        }
    } else if (event.key === "ArrowDown") {
        if(rightPaddle.y < canvas.height - rightPaddle.height){
            rightPaddle.dy = 5; // Mueve la paleta derecha hacia abajo
        }else{
            rightPaddle.dy = 0;  
        }
    }

    if (event.key === "w") {
        if(leftPaddle.y > 0){
            leftPaddle.dy = -5; // Mueve la paleta izquierda hacia arriba
        }else{
            leftPaddle.dy = 0;
        }
    } else if (event.key === "s") {
        if(leftPaddle.y < canvas.height - leftPaddle.height){
            leftPaddle.dy = 5; // Mueve la paleta izquierda hacia abajo
        }else{
            leftPaddle.dy = 0;
        }
    }
});

// Para detener el movimiento de las palas cuando se suelta la tecla
document.addEventListener("keyup", (event: KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        rightPaddle.dy = 0; // Detener la paleta derecha
    }

    if (event.key === "w" || event.key === "s") {
        leftPaddle.dy = 0; // Detener la paleta izquierda
    }
});


// Función para iniciar el juego
startGameBtn.addEventListener("click", () => {
    if (!isGamePaused) {
        isGamePaused = true;
        cancelAnimationFrame(animation); // Pausar el juego
        startGameBtn.innerText = "Reanudar Juego";
    }else{
        if(!newGame){
            isGamePaused = false;
            gameLoop();
            startGameBtn.innerText = "Pausar Juego";
        }else{
            isGamePaused = false;
            newGame = false;
            showCountdown(() => {
               gameLoop();
                 startGameBtn.innerText = "Pausar Juego";
           }); 
        }
    }
});

// Función para resetear el juego
resetGameBtn.addEventListener("click", () => {
    resetGameBtn.innerText = "Reiniciar Juego";
    resetAll(); // Resetea el juego
    isGamePaused = true;
    newGame = true;
    cancelAnimationFrame(animation); // Pausar el juego
    startGameBtn.innerText = "Iniciar Juego";
    drawGame();
});


