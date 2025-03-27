const numPlayersInput = document.getElementById('numPlayers') as HTMLInputElement;
const tournamentForm = document.getElementById('tournamentForm') as HTMLFormElement;
const playersInput = document.getElementById('playersInput') as HTMLDivElement;
const generateTournamentBtn = document.getElementById('generateTournamentBtn') as HTMLButtonElement;
const tournamentBracket = document.getElementById('tournamentBracket') as HTMLDivElement;
const gameView = document.getElementById('gameView') as HTMLDivElement;
const tournamentView = document.getElementById('tournamentView') as HTMLDivElement;

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
function generateBracket(): void {
    const numPlayers = parseInt(numPlayersInput.value);
    const players: string[] = [];
    const playerNamesSet = new Set<string>();

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
    generateTournamentTree(players);

    // Ocultar elementos del formulario, excepto el botón de reset
    tournamentForm.style.display = 'none';
    playersInput.style.display = 'none';

    // Cambiar el texto y la funcionalidad del botón
    generateTournamentBtn.textContent = 'Nuevo Torneo';
    generateTournamentBtn.onclick = resetTournament;

}


function generateTournamentTree(players: string[]): void {
    tournamentBracket.innerHTML = '';

    // Mezclar los jugadores aleatoriamente
    players = shuffleArray([...players]);

    // Calcular el número de rondas necesarias
    const numRounds = Math.ceil(Math.log2(players.length));

    // Crear elemento de torneo
    const bracketElement = document.createElement('div');
    bracketElement.className = 'tournament-bracket';

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

        // Crear partidos
        for (let i = 0; i < currentRoundPlayers.length; i += 2) {
            // Crear botón para el partido
            const matchButton = document.createElement('button');
            matchButton.className = 'match-button';

            // Primer jugador
            const player1 = currentRoundPlayers[i] || 'Vacío';
            let player2 = '';

            // Segundo jugador (si existe)
            if (i + 1 < currentRoundPlayers.length) {
                player2 = currentRoundPlayers[i + 1] || 'Vacío';

                // Formato del texto del botón
                matchButton.textContent = `${player1} vs ${player2}`;

                // Añadir evento al botón
                matchButton.addEventListener('click', () => {
                    isTournament = true;
                    gameView.style.display = 'block';
                    tournamentView.style.display = 'none';
                    player1Name = player1;
                    player2Name = player2;
                    resetButtonLogic();
                });
                
            } else {
                // Si hay un jugador impar, pasa a la siguiente ronda
                nextRoundPlayers.push(currentRoundPlayers[i]);
            }

            // Formato del texto del botón
            matchButton.textContent = `${player1} vs ${player2}`;

            // Añadir el botón a la columna
            columnElement.appendChild(matchButton);
        }

        // Añadir la columna al bracket
        bracketElement.appendChild(columnElement);

        // Preparar la siguiente ronda
        currentRoundPlayers = nextRoundPlayers;
    }

    tournamentBracket.appendChild(bracketElement);
}

// Función auxiliar para mezclar jugadores
function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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