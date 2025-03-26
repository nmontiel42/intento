const stop3dGame = document.getElementById('stop3dGame') as HTMLButtonElement;
const reset3dGame = document.getElementById('reset3dGame') as HTMLButtonElement;
const lang = localStorage.getItem('lang');

let isPaused = false;

stop3dGame.addEventListener('click', () => {

    isPaused = !isPaused;

    if (isPaused) {
        stop3dGame.innerHTML = "Reanudar juego";
    } else {
        stop3dGame.innerHTML = "Pausar juego";
    }
});

reset3dGame.addEventListener('click', () => {
    console.log("has reseteado el juego");
});