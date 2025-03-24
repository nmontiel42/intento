document.addEventListener('DOMContentLoaded', () => {
    const localPlayButton = document.getElementById('localPlay') as HTMLParagraphElement;
    const tourPlayButton = document.getElementById('tourPlay') as HTMLParagraphElement;
    const gameView = document.getElementById('gameView') as HTMLDivElement;
    const tournamentView = document.getElementById('tournamentView') as HTMLDivElement;
  
    localPlayButton.addEventListener('click', () => {
      gameView.style.display = 'block';
      tournamentView.style.display = 'none';
    });
  
    tourPlayButton.addEventListener('click', () => {
      gameView.style.display = 'none';
      tournamentView.style.display = 'block';
    });
  });