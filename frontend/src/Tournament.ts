document.addEventListener('DOMContentLoaded', () => {
    const numPlayersInput = document.getElementById('numPlayers') as HTMLInputElement;
    const tournamentForm = document.getElementById('tournamentForm') as HTMLFormElement;

    // Prevenir el comportamiento predeterminado del formulario
    tournamentForm.addEventListener('submit', (event) => {
        event.preventDefault();
    });

    // Agregar event listener al campo de entrada numPlayers
    numPlayersInput.addEventListener('change', createTournament);
});

// Crear el formulario para ingresar los nombres de los jugadores
function createTournament(): void {
    const numPlayersInput = document.getElementById('numPlayers') as HTMLInputElement;
    const numPlayers = parseInt(numPlayersInput.value);
    const playersInput = document.getElementById('playersInput') as HTMLDivElement;
    const generateTournamentBtn = document.getElementById('generateTournamentBtn') as HTMLButtonElement;
    playersInput.innerHTML = '';

    // Validar el rango permitido
    if (numPlayers < 2 || numPlayers > 8) {
        alert('El número de jugadores debe estar entre 2 y 8.');
        return;
    }
    
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
    const numPlayersInput = document.getElementById('numPlayers') as HTMLInputElement;
    const numPlayers = parseInt(numPlayersInput.value);
    const players: string[] = [];
    const playerNamesSet = new Set<string>();


    // Elementos del formulario
    const tournamentForm = document.getElementById('tournamentForm') as HTMLFormElement;
    const playersInput = document.getElementById('playersInput') as HTMLDivElement;
    const generateTournamentBtn = document.getElementById('generateTournamentBtn') as HTMLButtonElement;

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
    numPlayersInput.style.display = 'none';
    playersInput.style.display = 'none';

    // Cambiar el texto y la funcionalidad del botón
    generateTournamentBtn.textContent = 'Nuevo Torneo';
    generateTournamentBtn.onclick = resetTournament;

}

function generateTournamentTree(players: string[]): void {
    const tournamentBracket = document.getElementById('tournamentBracket') as HTMLDivElement;
    tournamentBracket.innerHTML = '';

    // Mezclar los jugadores aleatoriamente
    players = shuffleArray([...players]);

    // Calcular el número de rondas necesarias y ajustar el número de jugadores a una potencia de 2
    const numRounds = Math.ceil(Math.log2(players.length));
    const totalSlots = Math.pow(2, numRounds);
    
    // Ajustar emparejamientos sin usar BYE
    const matchedPlayers: string[] = [];
    for (let i = 0; i < players.length; i += 2) {
        if (i + 1 < players.length) {
            // Pareja completa
            matchedPlayers.push(players[i], players[i + 1]);
        } else {
            // Jugador suelto pasa directamente
            matchedPlayers.push(players[i]);
        }
    }
    
    // Completar con espacios vacíos si es necesario
    while (matchedPlayers.length < totalSlots) {
        matchedPlayers.push('');
    }
    
    // Crear estructura del torneo
    tournamentBracket.className = 'tournament-bracket';
    
    // Contenedor para todas las rondas
    const bracketContainer = document.createElement('div');
    bracketContainer.className = 'bracket-container';
    tournamentBracket.appendChild(bracketContainer);
    
    // Crear cada ronda
    for (let round = 0; round < numRounds + 1; round++) {
        const roundContainer = document.createElement('div');
        roundContainer.className = 'round-container';
        
        // Título de la ronda
        const roundTitle = document.createElement('h3');
        roundTitle.className = 'round-title';
        roundTitle.textContent = round === 0 ? 'Primera Ronda' : 
                                  round === numRounds ? 'Campeón' : 
                                  `Ronda ${round + 1}`;
        roundContainer.appendChild(roundTitle);
        
        // Contenedor para los partidos de esta ronda
        const matchesContainer = document.createElement('div');
        matchesContainer.className = 'matches-container';
        roundContainer.appendChild(matchesContainer);
        
        // Calcular cuántos partidos hay en esta ronda
        const matchesInRound = Math.pow(2, numRounds - round);
        
        if (round === 0) {  // Primera ronda - jugadores iniciales
            for (let i = 0; i < matchedPlayers.length; i += 2) {
                const matchContainer = document.createElement('div');
                matchContainer.className = 'match-container';
                
                // Jugador 1
                const player1Container = document.createElement('div');
                player1Container.className = 'player-container';
                const player1 = document.createElement('div');
                player1.className = 'player';
                player1.textContent = matchedPlayers[i] || '';
                player1Container.appendChild(player1);
                matchContainer.appendChild(player1Container);
                
                // Jugador 2 (si existe)
                if (i + 1 < matchedPlayers.length && matchedPlayers[i + 1]) {
                    const player2Container = document.createElement('div');
                    player2Container.className = 'player-container';
                    const player2 = document.createElement('div');
                    player2.className = 'player';
                    player2.textContent = matchedPlayers[i + 1];
                    player2Container.appendChild(player2);
                    matchContainer.appendChild(player2Container);
                }
                
                matchesContainer.appendChild(matchContainer);
            }
        } else {  // Rondas siguientes - casillas vacías para los ganadores
            for (let i = 0; i < matchesInRound; i++) {
                const matchContainer = document.createElement('div');
                matchContainer.className = 'match-container';
                
                const playerContainer = document.createElement('div');
                playerContainer.className = 'player-container';
                const player = document.createElement('div');
                player.className = 'player';
                player.textContent = '';  // Casilla vacía para el ganador
                playerContainer.appendChild(player);
                matchContainer.appendChild(playerContainer);
                
                matchesContainer.appendChild(matchContainer);
            }
        }
        
        bracketContainer.appendChild(roundContainer);
    }
    
    // Añadir estilos CSS para el cuadro del torneo
    addTournamentStyles();
}

// Función para añadir estilos CSS al cuadro del torneo
function addTournamentStyles(): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .tournament-bracket {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 30px;
            overflow-x: auto;
            width: 100%;
        }
        
        .bracket-container {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            min-width: 100%;
        }
        
        .round-container {
            display: flex;
            flex-direction: column;
            margin: 0 20px;
            min-width: 180px;
        }
        
        .round-title {
            text-align: center;
            margin-bottom: 15px;
            color: #318ED6;
            font-size: 16px;
        }
        
        .matches-container {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 100%;
        }
        
        .match-container {
            display: flex;
            flex-direction: column;
            margin: 10px 0;
            position: relative;
        }
        
        .player-container {
            position: relative;
            margin: 5px 0;
        }
        
        .player-container:first-child:nth-last-child(2) {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        .match-container .player-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .player-container:before {
            content: '';
            position: absolute;
            right: -20px;
            top: 50%;
            width: 20px;
            height: 2px;
            background-color: #BE36CD;
            box-shadow: 0 0 3px #BE36CD;
        }
        
        .round-container:last-child .player-container:before {
            display: none;
        }
        
        .match-container:after {
            content: '';
            position: absolute;
            right: -20px;
            top: 50%;
            width: 2px;
            height: calc(100% + 20px);
            background-color: #BE36CD;
            box-shadow: 0 0 3px #BE36CD;
        }
        
        .match-container:last-child:after {
            display: none;
        }
        
        .player {
            border: 1px solid #BE36CD;
            padding: 10px;
            width: 150px;
            text-align: center;
            font-size: 14px;
            color: white;
            background-color: rgba(11, 34, 90, 0.85);
            border-radius: 5px;
            box-shadow: 0 0 5px #BE36CD;
        }
    `;
    
    // Añadir estilo solo si no existe ya
    if (!document.querySelector('style#tournament-styles')) {
        styleElement.id = 'tournament-styles';
        document.head.appendChild(styleElement);
    }
}

// Modificación de la función de reset
function resetTournament(): void {
    const numPlayersInput = document.getElementById('numPlayers') as HTMLInputElement;
    const playersInput = document.getElementById('playersInput') as HTMLDivElement;
    const tournamentBracket = document.getElementById('tournamentBracket') as HTMLDivElement;
    const generateTournamentBtn = document.getElementById('generateTournamentBtn') as HTMLButtonElement;

    // Restaurar los elementos del formulario
    numPlayersInput.style.display = 'inline-block';
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
}

// Añadir estilo adicional para alinear el input de número de jugadores
function addInputAlignmentStyle(): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #tournamentForm label {
            display: flex;
            align-items: center;
        }
        
        #numPlayers {
            margin-left: 10px;
        }
    `;
    document.head.appendChild(styleElement);
}

// Modificar el event listener inicial para añadir el estilo de alineación
document.addEventListener('DOMContentLoaded', () => {
    addInputAlignmentStyle();
});


// Función para mezclar un array aleatoriamente
function shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// Asegúrate de que las funciones estén disponibles globalmente
(window as any).createTournament = createTournament;
(window as any).generateBracket = generateBracket;