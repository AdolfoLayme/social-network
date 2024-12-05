import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  constructor(private auth: Auth, private firestore: Firestore) {}

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  getUsuarioActual(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => resolve(user));
    });
  }

  async obtenerDatosUsuario(uid: string): Promise<any> {
    const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
    const usuarioSnapshot = await getDoc(usuarioRef);
    if (usuarioSnapshot.exists()) {
      return usuarioSnapshot.data();
    }
    throw new Error('No se encontró información del usuario.');
  }

  async esPerfilCompletado(uid: string): Promise<boolean> {
    const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
    const usuarioSnapshot = await getDoc(usuarioRef);
    return usuarioSnapshot.exists() && usuarioSnapshot.data()['perfilCompletado'] || false;
  }
}
