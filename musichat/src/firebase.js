/* eslint-disable no-unused-vars */
import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider,
    getAuth, signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail,
    signOut, } from 'firebase/auth'
import { getFirestore, query, getDocs, collection, where, addDoc, } from 'firebase/firestore'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyCv6-Wgcxm9g0yAphsLCgLS2u0B8FIEHAk",
    authDomain: "yolowebapp.firebaseapp.com",
    projectId: "yolowebapp",
    storageBucket: "yolowebapp.appspot.com",
    messagingSenderId: "326194267075",
    appId: "1:326194267075:web:97cef1e91b65cfd4e47376",
    measurementId: "G-MG6VPD5B64"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async() => {
	try {
		const res = await signInWithPopup(auth, googleProvider);
		const user = res.user;
		const q = query(collection(db, "users"), where("uid", "==", user.uid));
		const docs = await getDocs(q);
		if (docs.docs.length === 0) {
			await addDoc(collection(db, "users"), {
				uid: user.uid,
				name: user.displayName,
				authProvider: "google",
				email: user.email,
			});
		}
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const logInWithEmailAndPassword = async(email, password) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const registerWithEmailAndPassword = async(name, email, password) => {
	try {
		const res = await createUserWithEmailAndPassword(auth, email, password);
		const user = res.user;
		await addDoc(collection(db, "users"), {
			uid: user.uid,
			name,
			authProvider: "local",
			email,
		});
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const sendPasswordReset = async(email) => {
	try {
		await sendPasswordResetEmail(auth, email);
		alert("Password reset link sent!");
	} catch (err) {
		console.error(err);
		alert(err.message);
	}
};
const logout = () => {
	signOut(auth);
};
export {
	auth,
	db,
	signInWithGoogle,
	logInWithEmailAndPassword,
	registerWithEmailAndPassword,
	sendPasswordReset,
	logout,
};