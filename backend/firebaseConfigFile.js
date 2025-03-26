import { initializeApp } from 'firebase/app';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import firebaseAdmin from 'firebase-admin';
import dotenv from 'dotenv';
import db from './src/database.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
//import { getFirestore, collection, doc, addDoc, getDoc, deleteDoc } from 'firebase/firestore';

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

const mailTransport = nodemailer.createTransport({
    service: 'gmail',  // O tu proveedor de email preferido
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD, // Contraseña de aplicación para Gmail
    },
});

export const adminAuth = firebaseAdmin.auth();

/* export const generatePhoneVerificationCode = async (uid, phoneNumber) => {
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
} */

export const generateEmailVerificationCode = async (email) => {
	try{
		const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
		const saltRounds = 10;
		const hashedCode = await bcrypt.hash(verificationCode, saltRounds);
		const expiresAt = new Date();
		expiresAt.setMinutes(expiresAt.getMinutes() + 10);
		const sessionInfo = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
		await storeVerificationCode(sessionInfo, hashedCode, email, expiresAt);
		await sendVerificationEmail(email, verificationCode);
		return{
			sessionInfo,
			email
		};
	}catch (error){
		console.error("Error generating email verification code:", error);
		throw error;
	}
};

export const verifyEmailVerificationCode = async (sessionInfo, code) => {
	try{
		if (!sessionInfo || !code){
			console.error("Missing required parameters:", { sessionInfo: !!sessionInfo, code: !!code});ç
			throw new Error("Session info and verification code are required");
		}
		const verificationData = await getVerificationCode(sessionInfo);
		console.log("Verification data retrieved:", verificationData ? "Data found" : "Data not found");
		if (!verificationData){
			throw new Error("Verification session not found");
		}
		if (!verificationData.code){
			console.error("No code found in verification data");
			throw new Error("Verification code data is invalid");
		}
		const expiresAt = new Date(verificationData.expires_at);
		if (expiresAt < new Date()){
			throw new Error("Verification code expired");
		}
		console.log("Comparing code with hash");
		const isValid = await bcrypt.compare(code, verificationData.code);
		if (isValid){
			await clearVerificationCode(sessionInfo);
			return true;
		}else{
			throw new Error("Invalid verification code");
		}
	}catch(error){
		console.error("Error verifying email code:", error);
		throw error; 
	}
};

async function sendVerificationEmail(email, code) {
    // Mantener el log para depuración
    console.log(`VERIFICATION CODE for ${email}: ${code}`);
    //desactivado para que no me pete el movil a emails
   /*  const mailOptions = {
        from: `"${process.env.APP_NAME || 'Security Team'}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Tu código de verificación 2FA',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #4CAF50; text-align: center;">Tu código de verificación</h2>
                <div style="text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 4px; margin: 20px 0; font-size: 24px; letter-spacing: 3px;">
                    <strong>${code}</strong>
                </div>
                <p>Este código expirará en 10 minutos.</p>
                <p>Si no solicitaste este código, por favor ignora este correo.</p>
            </div>
        `
    };
    
    try {
        const info = await mailTransport.sendMail(mailOptions);
        console.log(`Email enviado a ${email}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Error enviando email:', error);
        // Durante desarrollo, retorna true para que la app siga funcionando
        // incluso si el email falla
        return true;
    } */
}

async function storeVerificationCode(sessionInfo, hashedCode, email, expiresAt) {
    return new Promise((resolve, reject) => {
        db.run(
            `INSERT INTO verification_codes (session_info, code, email, expires_at, created_at) 
             VALUES (?, ?, ?, datetime(?), datetime('now'))`,
            [sessionInfo, hashedCode, email, expiresAt.toISOString()],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

async function getVerificationCode(sessionInfo) {
    return new Promise((resolve, reject) => {
        db.get(
            `SELECT * FROM verification_codes WHERE session_info = ?`,
            [sessionInfo],
            (err, row) => {
                if (err) reject(err);
                else resolve(row);
            }
        );
    });
}

async function clearVerificationCode(sessionInfo) {
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