const show3dGame = document.getElementById('show3dGame') as HTMLButtonElement;
const show3d = document.getElementById('show3d') as HTMLDivElement;
const showAdvert = document.getElementById('showAdvert') as HTMLDivElement;
const activateScore = document.getElementById('activateScore') as HTMLButtonElement;
const reset3dGame = document.getElementById('reset3dGame') as HTMLButtonElement;
const winView = document.getElementById('winView') as HTMLDivElement;
const closeWin = document.getElementById('closeWin') as HTMLButtonElement;
const winnerPlayer = document.getElementById('winnerPlayer') as HTMLDivElement;
const player1Score = document.getElementById('player1Score') as HTMLDivElement;
const player2Score = document.getElementById('player2Score') as HTMLDivElement;
const lang = localStorage.getItem('lang') || 'es';

let isActivated = false;

show3dGame.addEventListener('click', () => {
    showAdvert.style.display = 'none';
    show3d.style.display = 'block';
});

activateScore.addEventListener('click', () => {
    if (isActivated) {
        activateScore.innerText = '▶';
        isActivated = false;
    } else {
        activateScore.innerText = '⏸';
        isActivated = true;
    }
});

closeWin.addEventListener('click', () => {
    winView.style.display = 'none';
    show3d.style.display = 'block';
    showAdvert.style.display = 'none';
});