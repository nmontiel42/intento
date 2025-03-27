const show3dGame = document.getElementById('show3dGame') as HTMLButtonElement;
const show3d = document.getElementById('show3d') as HTMLDivElement;
const showAdvert = document.getElementById('showAdvert') as HTMLDivElement;
const reset3dGame = document.getElementById('reset3dGame') as HTMLButtonElement;
const activateScore = document.getElementById('activateScore') as HTMLButtonElement;
const winView = document.getElementById('winView') as HTMLDivElement;
const closeWin = document.getElementById('closeWin') as HTMLButtonElement;
const lang = localStorage.getItem('lang') || 'es';

let isActivated = false;

show3dGame.addEventListener('click', () => {
    showAdvert.style.display = 'none';
    show3d.style.display = 'block';
});

activateScore.addEventListener('click', () => {
    if (isActivated) {
        if (lang === 'es') activateScore.innerText = 'Activar Puntuación';
        if (lang === 'en') activateScore.innerText = 'Activate Score';
        if (lang === 'fr') activateScore.innerText = 'Activer le score';
        isActivated = false;
    } else {
        if (lang === 'es') activateScore.innerText = 'Desactivar Puntuación';
        if (lang === 'en') activateScore.innerText = 'Deactivate Score';
        if (lang === 'fr') activateScore.innerText = 'Désactiver le score';
        isActivated = true;
    }
});

closeWin.addEventListener('click', () => {
    winView.style.display = 'none';
    show3d.style.display = 'block';
    showAdvert.style.display = 'none';
});