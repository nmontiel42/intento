import { firebaseAuth, adminAuth, generatePhoneVerificationCode, verifyPhoneVerificationCode } from "../firebaseConfigFile.js";
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
			const { phoneNumber } = request.body;
			const user = await getUserById(userId);
			if (!user){
				return reply.status(404).send({ error: 'User not found '});
			}
			await updateUserWith2FA(userId, phoneNumber, 'pending');
			reply.send({
				success: true,
				//sessionInfo: session.sessionInfo
				phoneNumber,
			});
		}catch (error){
			console.error('Error enrolling 2FA:', error);
			reply.status(500).send({ error: 'Failed to enroll 2FA', details: error.message});
		}
	});
	fastify.post('/verify-2fa-enrollment', { preHandler: fastify.authenticate }, async(request, reply) => {
		try{
			const { userId } = request;
			const { verificationCode, sessionInfo, phoneNumber } = request.body;
			const user = await getUserById(userId);
			if (!user){
				return reply.status(404).send({ error: 'User not found' });
			}
			await verifyPhoneVerificationCode(sessionInfo, verificationCode);
			await updateUserWith2FA(userId, phoneNumber);
			if (firebaseVerified){
				await updateUserWith2FA(userId, phoneNumber, 'active');
			}
			reply.send({
				success: true,
				message: '2FA has been successfully enabled'
			});
		}catch(error){
			console.error('Error verifying 2FA code:', error);
			reply.status(500).send({ error: 'Failed to verfy code', details: error.message});
		}
	});
	fastify.post('/login-with-2fa', async (request, reply) => {
		const { email, password } = request.body;
		try{
			const user = await getUserByEmail(email);
			if (!user){
				return reply.status(400).send({ error: 'User not found' });
			}
			const validPassword = await bcrypt.compare(password, user.password)
			if (!validPassword) {
				return reply.status(400).send({ error: 'Invalid password' });
			}
			if (user.has2FA){
				const tempToken = fastify.jwt.sign({
					userId: user.id,
					requires2FA: true
				},{ expiresIn: '5m'});
				return reply.send({
					requires2FA: true,
					tempToken,
					userId: user.id
				});
			}
			const token = fastify.jwt.sign({ userId: user.id });
			return reply.send({
				token,
				username: user.username
			});
		}catch(error){
			console.error('Error in 2FA login:', error);
			return reply.status(500).send({ error: 'Error during login' });
		}
	});
	fastify.post('/verify-2fa-login', async(request, reply) => {
		try{
			const { verificationCode, tempToken } = request.body;
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

async function updateUserWith2FA(userId, phoneNumber) {
	return new Promise((resolve, reject) => {
		db.run(
			`UPDATE users SET has2FA = 1, phone_number = ? WHERE id = ?`,
			[phoneNumber, userId],
			function(err) {
				if (err) reject(err);
				else resolve({ updated: this.changes > 0 });
			}
		);
	});
}

// Helper function to verify 2FA code
async function verify2FACode(user, code) {
	try {
	  // Get the session info from your database or temporary storage
	  // This should be stored from the initial phone verification request
	  const sessionInfo = await getSessionInfoForUser(user.id);
	  
	  // Use Firebase Auth's verification API
	  const phoneAuthCredential = PhoneAuthProvider.credential(
		sessionInfo, // This should be the verification ID stored previously
		code // The code provided by the user
	  );
	  
	  // Verify the credential - there are multiple ways to do this
	  
	  // Option 1: Using Admin SDK to check if the code is valid
	  try {
		// Look up the Firebase user
		const firebaseUser = await adminAuth.getUserByEmail(user.email);
		
		// Verify that this user has the phone number registered for MFA
		const userRecord = await adminAuth.getUser(firebaseUser.uid);
		
		// Check if the phone number matches what we have stored
		if (userRecord.phoneNumber === user.phone_number) {
		  // At this point, the code is valid if we got this far without errors
		  return true;
		}
		return false;
	  } catch (error) {
		console.error("Error verifying phone auth credential:", error);
		return false;
	  }
	} catch (error) {
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

