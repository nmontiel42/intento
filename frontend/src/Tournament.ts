const numPlayersInput = document.getElementById('numPlayers') as HTMLInputElement;
const tournamentForm = document.getElementById('tournamentForm') as HTMLFormElement;
const playersInput = document.getElementById('playersInput') as HTMLDivElement;
const generateTournamentBtn = document.getElementById('generateTournamentBtn') as HTMLButtonElement;
const tournamentBracket = document.getElementById('tournamentBracket') as HTMLDivElement;
const gameView = document.getElementById('gameView') as HTMLDivElement;
const tournamentView = document.getElementById('tournamentView') as HTMLDivElement;

let tournamentId: string;

document.addEventListener('DOMContentLoaded', () => {
    // Prevenir el comportamiento predeterminado del formulario
    tournamentForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });

    // Agregar event listener al campo de entrada numPlayers
    numPlayersInput.addEventListener('change', createTournament);
    numPlayersInput.value = '0';

});

// Crear el formulario para ingresar los nombres de los jugadores
function createTournament(): void {
    const numPlayers = parseInt(numPlayersInput.value);
    playersInput.innerHTML = '';

    for (let i = 0; i < numPlayers; i++) {
        const playerInput = document.createElement('input');
        playerInput.type = 'text';
        playerInput.id = `player${i + 1}`;
        playerInput.name = `player${i + 1}`;
        playerInput.placeholder = `Nombre del Jugador ${i + 1}`;
        playersInput.appendChild(playerInput);
    }
    generateTournamentBtn.onclick = generateBracket;

}


// Generar la tabla de enfrentamientos
async function generateBracket(): Promise<void> {
    const numPlayers = parseInt(numPlayersInput.value);
    const players: string[] = [];
    const playerNamesSet = new Set<string>();

    // Validar jugadores
    for (let i = 0; i < numPlayers; i++) {
        const playerNameInput = document.getElementById(`player${i + 1}`) as HTMLInputElement;
        const playerName = playerNameInput.value.trim();

        if (playerName === '' || playerNamesSet.has(playerName)) {
            alert('Todos los jugadores deben tener un nombre único.');
            return;
        }

        playerNamesSet.add(playerName);
        players.push(playerName);
    }

    try {
        // Mostrar indicador de carga
        generateTournamentBtn.disabled = true;
        generateTournamentBtn.textContent = 'Creando torneo...';

        // Generar nombre para el torneo (puedes hacer que el usuario lo ingrese)
        const now = new Date();
        const tournamentName = `Torneo ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

        console.log('Jugadores:', players);
        console.log('Número de jugadores:', players.length);

        const response = await fetch('https://localhost:3000/tournament', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Añadir token de autenticación si es necesario
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                name: tournamentName,
                players: players
            })
        });

        if (!response.ok) {
            throw new Error('Error al crear el torneo');
        }

        const data = await response.json();
        console.log('Torneo creado:', data);

        // Guardar el ID del torneo para futuras operaciones
        tournamentId = data.tournament.id;
        localStorage.setItem('currentTournamentId', tournamentId.toString());

        // Ahora que tenemos 'winners' y 'nextRound', pasarlos a 'generateTournamentTree'
        const winners = data.winners || [];
        const nextRound = data.nextRound || [];

        // Generar la vista del bracket con los datos del servidor, ahora pasando 5 argumentos
        generateTournamentTree(players, data.tournament, data.matches, winners, nextRound);

        // Ocultar elementos del formulario, excepto el botón de reset
        tournamentForm.style.display = 'none';
        playersInput.style.display = 'none';

        // Cambiar el texto y la funcionalidad del botón
        generateTournamentBtn.textContent = 'Nuevo Torneo';
        generateTournamentBtn.disabled = false;
        generateTournamentBtn.onclick = resetTournament;

    } catch (error) {
        console.error('Error:', error);
        alert('Ocurrió un error al crear el torneo. Intenta nuevamente.');
        generateTournamentBtn.disabled = false;
        generateTournamentBtn.textContent = 'Generar Torneo';
    }
}



function generateTournamentTree(
    players: string[],
    tournament: any,
    matches: any[],
    winners: string[],  // Asegúrate de que 'winners' se pase correctamente
    nextRound: any[]  // También pasar 'nextRound'
): void {
    tournamentBracket.innerHTML = '';

    // Calcular el número de rondas necesarias
    const numRounds = Math.ceil(Math.log2(players.length));

    // Crear elemento de torneo
    const bracketElement = document.createElement('div');
    bracketElement.className = 'tournament-bracket';
    bracketElement.dataset.tournamentId = tournament.id.toString();

    // Preparar rondas
    let currentRoundPlayers = [...players];

    // Crear columnas para cada ronda
    for (let round = 0; round < numRounds; round++) {
        // Crear columna para esta ronda
        const columnElement = document.createElement('div');
        columnElement.className = 'tournament-column';

        // Título de columna
        const columnTitle = document.createElement('div');
        columnTitle.className = 'column-title';
        columnTitle.textContent = round === 0 ? 'Primera Ronda' :
            round === numRounds - 1 ? 'Final' :
                `Ronda ${round + 1}`;
        columnElement.appendChild(columnTitle);

        // Crear emparejamientos para esta ronda
        const nextRoundPlayers: string[] = [];

        // Si es la primera ronda, usa los partidos creados por el servidor
        if (round === 0) {
            for (const match of matches) {
                // Crear botón para el partido
                const matchButton = document.createElement('button');
                matchButton.className = 'match-button';
                matchButton.dataset.matchId = (match as any).match_id.toString();

                // Jugadores
                const player1 = (match as any).player1;
                const player2 = match.player2 || '';

                // Formato del texto del botón
                if (player2 == '') {
                    matchButton.textContent = `${player1}`;
                    matchButton.disabled = true;
                } else {
                    matchButton.textContent = `${player1} vs ${player2}`;
                }

                // Añadir evento al botón
                matchButton.addEventListener('click', () => {
                    //Enviar la informacion del match al partido
                    console.log('Partido seleccionado:', match);
                    console.log('ID del torneo:', tournament.id);
                    console.log('Jugador 1:', player1);
                    console.log('Jugador 2:', player2);

                    //Asignar nombres
                    currentMatchId = matchButton.dataset.matchId || '';
                    player1Name = player1;
                    player2Name = player2;
                    isTournament = true;
                    gameView.style.display = 'block';
                    tournamentView.style.display = 'none';
                    resetButtonLogic();
                });

                // Añadir el botón a la columna
                columnElement.appendChild(matchButton);

                // Simular ganador para generar las siguientes rondas (solo para visualización)
                if (match.winner) {
                    // Si ya hay un ganador guardado
                    nextRoundPlayers.push(match.winner);
                } else {
                    // Simulación - solo para mostrar la estructura
                    const winner = Math.random() < 0.5 ? player1 : player2;
                    nextRoundPlayers.push(winner);
                }
            }
        } else {
            // Para las rondas siguientes, usa los ganadores de la ronda anterior
            let index = 0;

            for (let i = 0; i < currentRoundPlayers.length; i += 2) {
                // Crear botón para el partido
                const matchButton = document.createElement('button');
                matchButton.className = 'match-button future-match';

                // Usar los ganadores de la ronda anterior para los nuevos emparejamientos
                const player1 = nextRound[index++];  // Asegúrate de que se obtengan los ganadores correctamente
                const player2 = nextRound[index++] || '';  // Asegurarse de que no haya undefined

                // Formato del texto del botón
                matchButton.textContent = `${player1} vs ${player2}`;
                matchButton.disabled = true; // Deshabilitar hasta que se determinen los jugadores

                // Añadir el botón a la columna
                columnElement.appendChild(matchButton);

                // Añadir los jugadores para la siguiente ronda
                if (player2 !== '') {
                    nextRoundPlayers.push(player1);
                    nextRoundPlayers.push(player2);
                } else {
                    nextRoundPlayers.push(player1);  // En caso de un número impar
                }
            }
        }

        // Añadir la columna al bracket
        bracketElement.appendChild(columnElement);

        // Preparar la siguiente ronda
        currentRoundPlayers = nextRoundPlayers;
    }

    tournamentBracket.appendChild(bracketElement);
}

function updateBracket(): void {
    // Don't clear the entire bracket
    const tournamentId = localStorage.getItem('currentTournamentId');
    
    // First check if we have a winner for the tournament
    if (winners.length === 1) {
      // Show tournament winner
      const winnerElement = document.createElement('div');
      winnerElement.className = 'tournament-winner';
      winnerElement.innerHTML = `<h2>¡${winners[0]} ha ganado el torneo!</h2>`;
      tournamentBracket.appendChild(winnerElement);
      
      // Add a button to create a new tournament
      const newTournamentBtn = document.createElement('button');
      newTournamentBtn.className = 'new-tournament-btn';
      newTournamentBtn.textContent = 'Crear nuevo torneo';
      newTournamentBtn.onclick = resetTournament;
      tournamentBracket.appendChild(newTournamentBtn);
      
      // Show tournament view
      gameView.style.display = 'none';
      tournamentView.style.display = 'block';
      return;
    }
    
    // Find all future match buttons
    const futureMatches = document.querySelectorAll('.future-match');
    
    // If we have nextRound matches, update the buttons
    if (nextRound && nextRound.length > 0) {
      let matchIndex = 0;
      
      futureMatches.forEach((matchBtn) => {
        const matchButton = matchBtn as HTMLButtonElement;
        if (matchIndex < nextRound.length) {
          const match = nextRound[matchIndex];
          const player1 = (match as any).player1;
          const player2 = (match as any).player2 || '...';
          
          matchButton.textContent = `${player1} vs ${player2}`;
          matchButton.dataset.matchId = (match as any).match_id.toString();
          
          // Only enable the button if both players are determined
          if (player2 !== '...' && player2 !== '') {
            matchButton.disabled = false;
            matchButton.classList.remove('future-match');
            
            // Add event listener for playing the match
            matchButton.addEventListener('click', () => {
              currentMatchId = matchButton.dataset.matchId || '';
              player1Name = player1;
              player2Name = player2;
              isTournament = true;
              gameView.style.display = 'block';
              tournamentView.style.display = 'none';
              resetButtonLogic();
            });
          }
          
          matchIndex++;
        }
      });
    }
    
    // Show tournament view
    gameView.style.display = 'none';
    tournamentView.style.display = 'block';
  }
  
  // Add function to return to tournament from game
  function returnToTournament(): void {
    gameView.style.display = 'none';
    tournamentView.style.display = 'block';
  }
// Modificación de la función de reset
function resetTournament(): void {

    // Restaurar los elementos del formulario
    tournamentForm.style.display = 'inline-block';
    playersInput.style.display = 'block';

    // Limpiar los campos de entrada de jugadores
    numPlayersInput.value = '2'; // Reiniciar a 2 jugadores por defecto
    playersInput.innerHTML = ''; // Limpiar los campos de nombres

    // Limpiar el bracket del torneo
    tournamentBracket.innerHTML = '';

    // Restaurar la funcionalidad original del botón
    generateTournamentBtn.textContent = 'Generar Torneo';
    generateTournamentBtn.onclick = generateBracket;

    // Volver a crear los inputs de jugadores
    createTournament();
    numPlayersInput.value = '2';
}

// Asegúrate de que las funciones estén disponibles globalmente
(window as any).createTournament = createTournament;
(window as any).generateBracket = generateBracket;