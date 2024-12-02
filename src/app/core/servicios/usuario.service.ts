import { Injectable } from '@angular/core';
import { Auth, User, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  // Método de registro
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Método de inicio de sesión
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Método para obtener el usuario actual autenticado
  getUsuarioActual(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => resolve(user));
    });
  }

  // Método para obtener datos del usuario desde Firestore
  async obtenerDatosUsuario(uid: string): Promise<any> {
    const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
    const usuarioSnapshot = await getDoc(usuarioRef);
    if (usuarioSnapshot.exists()) {
      return usuarioSnapshot.data();
    } else {
      throw new Error('No se encontró información del usuario.');
    }
  }
}
