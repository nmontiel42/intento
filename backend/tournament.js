import { 
    createTournament, getTournamentById, getAllTournaments, updateTournamentWinner
} from './models/tournamentModel.js';
import {
    createMatch, getMatchesByTournament, updateMatchResult
} from './models/t_matchModel.js';

import { getUserIdByName } from './auth.js';

export default async function (fastify, options) {
    // Crear un nuevo torneo
    fastify.post('/tournament', { preHandler: fastify.authenticate }, async (request, reply) => {

        console.log('Objeto request.user completo:', JSON.stringify(request.user, null, 2));

        const { name, players } = request.body;
        const username = request.user.user;

        try {
            const userObj = await getUserIdByName(username);
            const created_by = userObj ? userObj.id : null;

            console.log('Nombre de usuario: ', username);
            console.log('ID del usuario encontrado: ', created_by);

            const num_players = players.length;

            console.log('Nombre del torneo: ', name);
            console.log('Número de jugadores: ', num_players);

            const tournament = await createTournament({ name, num_players, created_by });

            // Mezclar aleatoriamente los jugadores
            const shuffledPlayers = [...players];
            for (let i = shuffledPlayers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
            }

            // Crear los emparejamientos
            const matches = [];
            for (let i = 0; i < shuffledPlayers.length; i += 2) {
                const player1 = shuffledPlayers[i];
                // Si queda un jugador sin emparejar, player2 quedará como null o una cadena vacía
                const player2 = i + 1 < shuffledPlayers.length ? shuffledPlayers[i + 1] : null;
                
                const match = await createMatch({ 
                    tournament_id: tournament.id,
                    player1: player1, 
                    player2: player2 
                });
                
                matches.push(match);
            }
            console.log('Matches creados: ', matches);
            reply.send({ success: true, tournament, matches });
        } catch (error) {
            console.error('Error al crear torneo:', error);
            reply.status(500).send({ error: 'Error al crear el torneo' });
        }
    });
    
    // Obtener todos los torneos
    fastify.get('/tournaments', async (request, reply) => {
        try {
            const tournaments = await getAllTournaments();
            reply.send(tournaments);
        } catch (error) {
            console.error('Error al obtener torneos:', error);
            reply.status(500).send({ error: 'Error al obtener los torneos' });
        }
    });
    
    fastify.put('/api/matches/:id', async (request, reply) => {
        const { id } = request.params;
        const { player1_score, player2_score, winner } = request.body;
        
        try {
            const result = await updateMatchResult(id, player1_score, player2_score, winner);
            reply.send({ success: true, result });
        } catch (error) {
            console.error('Error al actualizar partido:', error);
            reply.code(500).send({ error: 'Error al actualizar el partido' });
        }
    });

    fastify.get('/matches/:tournamentId', async (request, reply) => {
        const { tournamentId } = request.params;

        try {
            const matches = await getMatchesByTournament(tournamentId);
            reply.send(matches);
        } catch (error) {
            console.error('Error al obtener partidos:', error);
            reply.status(500).send({ error: 'Error al obtener los partidos' });
        }
    });
}