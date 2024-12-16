import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  constructor(private auth: Auth, private firestore: Firestore) { }
  async loginConGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      const userRef = doc(this.firestore, 'usuarios', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          nombre: user.displayName,
          email: user.email,
          creadoEn: new Date(),
        });
        console.log('Usuario registrado en Firestore.');
      }
      return user;
    } catch (error) {
      console.error('Error en inicio de sesión con Google:', error);
      throw error;
    }
  }

  logout() {
    return signOut(this.auth);
  }

  recuperarContrasena(correo: string) {
    return sendPasswordResetEmail(this.auth, correo)
      .then(() => {
        console.log('Correo de recuperación enviado correctamente.');
      })
      .catch((error) => {
        console.error('Error al enviar el correo de recuperación:', error);
        throw error;
      });
  }
}
