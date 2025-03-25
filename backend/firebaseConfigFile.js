import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseAdmin from 'firebase-admin';
import dotenv from 'dotenv';
import db from './src/database.js';

dotenv.config();

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SEND,
	appId: process.env.FIREBASE_APP_ID
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

const adminApp = firebaseAdmin.initializeApp({
	credential: firebaseAdmin.credential.cert({
	  projectId: process.env.FIREBASE_PROJECT_ID,
	  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
	  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
	})
});

export const adminAuth = firebaseAdmin.auth();

export const generatePhoneVerificationCode = async (uid, phoneNumber) => {
	const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
	console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);
	const sessionInfo = `${uid}-${Date.now()}`;
	await storeVerificationCode(sessionInfo, verificationCode);
	return { sessionInfo };
};

export const verifyPhoneVerificationCode = async (sessionInfo, code) => {
	const storedCode = await getStoredVerificationCode(sessionInfo);
	if (!storedCode){
		throw new Error('Invalid session or expired code');
	}
	if (storedCode !== code){
		throw new Error ('Invalid verification code');
	}
	await clearVerificationCode(sessionInfo);
	return true;
}

async function storeVerificationCode(sessionInfo, code){
	return new Promise((resolve, reject) => {
		db.run(
			`INSERT INTO verification_codes (session_info, code, created_at) VALUES (?, ?, datetime('now'))`,
			[sessionInfo, code],
			(err) => {
				if (err) reject(err);
				else resolve();
			}
		);
	});
}

async function getStoredVerificationCode(sessionInfo){
	return new Promise((resolve, reject) => {
		db.get(
			`SELECT code FROM verification_codes WHERE session_info = ? AND datetime('now') < datetime(created_at, '+10 minutes')`,
			[sessionInfo],
			(err, row) => {
				if (err) reject(err);
				else resolve(row ? row.code : null);
			}
		);
	});
}

async function clearVerificationCode(sessionInfo){
	return new Promise((resolve, reject) => {
		db.run(
			`DELETE FROM verification_codes WHERE session_info = ?`,
			[sessionInfo],
			(err) => {
				if (err) reject(err);
				else resolve();
			}
		);
	});
}