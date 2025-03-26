import { firebaseAuth, adminAuth, generateEmailVerificationCode, verifyEmailVerificationCode } from "../firebaseConfigFile.js";
import db from '../src/database.js';
import {
	PhoneAuthProvider,
	RecaptchaVerifier,
	signInWithCredential,
	multiFactor,
	getMultiFactorResolver
} from 'firebase/auth';
import bcrypt from 'bcrypt';

export default async function(fastify, options) {
	fastify.get('/2fa-test', async(request, reply) => {
		return { status: 'ok', message: '2FA routes are registered' };
	});
	console.log('Registering 2FA routes');
	fastify.post('/enroll-2fa', { preHandler:fastify.authenticate }, async(request, reply) => {
		console.log('Received request to /enroll-2fa');
		try{
			const { userId } = request;
			const { email } = request.body;
			const user = await getUserById(userId);
			if (!user){
				return reply.status(404).send({ error: 'User not found '});
			}
			const session = await generateEmailVerificationCode(email);
			await saveSessionInfo(userId, session.sessionInfo);
			await updateUserWith2FA(userId, email, 'pending');
			reply.send({
				success: true,
				sessionInfo: session.sessionInfo,
				email
			});
		}catch (error){
			console.error('Error enrolling 2FA:', error);
			reply.status(500).send({ error: 'Failed to enroll 2FA', details: error.message});
		}
	});
	fastify.post('/verify-2fa-enrollment', { preHandler: fastify.authenticate }, async(request, reply) => {
		try{
			const { userId } = request;
			const { verificationCode, sessionInfo, email } = request.body;
			const user = await getUserById(userId);
			if (!user){
				return reply.status(404).send({ error: 'User not found' });
			}
			const emailVerified = await verifyEmailVerificationCode(sessionInfo, verificationCode);
			if (emailVerified){
				await updateUserWith2FA(userId, email, 'active');
				reply.send({
					success: true,
					message: '2FA has been successfully enabled'
				});
			}else{
				reply.status(400).send({ error: 'Invalid verification code' });
			}
		}catch(error){
			console.error('Error verifying 2FA code:', error);
			reply.status(500).send({ error: 'Failed to verfy code', details: error.message});
		}
	});
	fastify.post('/login-with-2fa', async (request, reply) => {
		const { email, password } = request.body;
		try {
			const user = await getUserByEmail(email);
			if (!user) {
				return reply.status(400).send({ error: 'User not found' });
			}
			
			const validPassword = await bcrypt.compare(password, user.password)
			if (!validPassword) {
				return reply.status(400).send({ error: 'Invalid password' });
			}
			
			if (user.has2FA) {
				// NUEVO: Generar y enviar un nuevo código de verificación
				const emailTo = user["2fa_email"] || user.email;
				const session = await generateEmailVerificationCode(emailTo);
				
				// Guardar la sesión
				await saveSessionInfo(user.id, session.sessionInfo);
				
				// Generar token temporal
				const tempToken = fastify.jwt.sign({
					userId: user.id,
					requires2FA: true
				}, { expiresIn: '5m' });
				
				return reply.send({
					requires2FA: true,
					tempToken,
					userId: user.id,
					sessionInfo: session.sessionInfo,
					message: 'Verification code sent to your email'
				});
			}
			
			// Usuario sin 2FA
			const token = fastify.jwt.sign({ userId: user.id });
			return reply.send({
				token,
				username: user.username
			});
		} catch(error) {
			console.error('Error in 2FA login:', error);
			return reply.status(500).send({ error: 'Error during login' });
		}
	});
	fastify.post('/verify-2fa-login', async(request, reply) => {
		try{
			const { verificationCode, tempToken } = request.body;
			if (!verificationCode || !tempToken) {
                return reply.status(400).send({ error: 'Missing required fields' });
            }
			let decoded;
			try{
				decoded = fastify.jwt.verify(tempToken);
				if (!decoded.requires2FA){
					return reply.status(400).send({ error: 'invalid token' });
				}
			}catch(error){
				return reply.status(401).send({error: 'Invalid or expired token '});
			}
			const userId = decoded.userId;
			const user = await getUserById(userId);
			const isValidCode = await verify2FACode(user, verificationCode);
			if (!isValidCode){
				return reply.status(401).send({ error: 'Invalid verification code' });
			}
			const token = fastify.jwt.sign({ userId: user.id });
			return reply.send({
				token,
				username: user.username
			});
		}catch (error){
			console.error('Error verifying 2FA loign:', error);
			reply.status(500).send({ error: 'Failed to verify 2FA', details: error.message });
		}
	});
	fastify.get('/2fa-status', { preHandler: fastify.authenticate }, async (request, reply) => {
		try {
			const { userId } = request;
			
			// Obtener el usuario desde la base de datos
			const user = await getUserById(userId);
			if (!user) {
				return reply.status(404).send({ error: 'User not found' });
			}
			
			// Devolver el estado de 2FA
			return reply.send({
				enabled: user.has2FA === 1 && user.two_fa_status === 'active'
			});
		} catch (error) {
			console.error('Error getting 2FA status:', error);
			return reply.status(500).send({ error: 'Internal server error' });
		}
	});
	fastify.post('/disable-2fa', { preHandler: fastify.authenticate }, async (request, reply) => {
		console.log('Received request to disable 2FA:', {
			headers: request.headers,
			userId: request.userId,
			body: request.body
		});
		
		try {
			const { userId } = request;
			console.log('User ID from token:', userId);
			
			if (!userId) {
				console.error('No userId found in authenticated request');
				return reply.status(400).send({ error: 'Authentication error - no user ID' });
			}
			
			// Obtener el usuario desde la base de datos
			const user = await getUserById(userId);
			console.log('User found:', user ? 'yes' : 'no');
			
			if (!user) {
				return reply.status(404).send({ error: 'User not found' });
			}
			
			// Desactivar 2FA
			console.log('Disabling 2FA for user:', userId);
			await db.run(
				`UPDATE users SET has2FA = 0, two_fa_status = 'inactive' WHERE id = ?`,
				[userId]
			);
			
			console.log('2FA disabled successfully');
			return reply.send({
				success: true,
				message: '2FA has been successfully disabled'
			});
		} catch (error) {
			console.error('Error disabling 2FA:', error);
			return reply.status(500).send({ error: 'Internal server error', details: error.message });
		}
	});
}

async function getUserById(id){
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT * FROM users WHERE id = ?`,
			[id],
			(err, row) => {
				if (err) reject(err);
				else resolve(row);
			}
		);
	});
}

async function updateUserWith2FA(userId, email, status = 'active') {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE users SET "has2FA" = 1, "2fa_email" = ?, two_fa_status = ? WHERE id = ?`,
			[email, status, userId],
			function(err) {
				if (err) reject(err);
				else resolve({ updated: this.changes > 0 });
			}
		);
	});
}

async function saveSessionInfo(userId, sessionInfo){
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO user_2fa_sessions (user_id, session_info, created_at)
			 VALUES (?, ?, datetime('now'))`,
			[userId, sessionInfo],
			function(err){
				if (err) reject(err);
				else resolve({ id: this.lastID});
			}
		);
	});
}

// Helper function to verify 2FA code
async function verify2FACode(user, code) {
	try{
		const sessionInfo = await getSessionInfoForUser(user.id);
		if (!sessionInfo){
			return false;
		}
		return await verifyEmailVerificationCode(sessionInfo, code);
	}catch(error){
		console.error("Error in verify2FACode:", error);
		return false;
	}
  }

async function getSessionInfoForUser(userId) {
	return new Promise((resolve, reject) => {
	 db.get(
		`SELECT session_info FROM user_2fa_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`,
		[userId],
		(err, row) => {
		 if (err) reject(err);
		 else resolve(row ? row.session_info : null);
		}
	 );
	});
}

async function getUserByEmail(email) {
	return new Promise((resolve, reject) => {
	  db.get(
		`SELECT * FROM users WHERE email = ?`,
		[email],
		(err, row) => {
		  if (err) reject(err);
		  else resolve(row);
		}
	  );
	});
  }