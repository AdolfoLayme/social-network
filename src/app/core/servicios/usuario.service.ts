import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  UserCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private perfilActualizadoSubject = new BehaviorSubject<any>(null);
  perfilActualizado$ = this.perfilActualizadoSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {}


  notificarPerfilActualizado(usuario: any): void {
    this.perfilActualizadoSubject.next(usuario);
  }


  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }


  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }


  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Sesión cerrada con éxito.');
    } catch (error) {
      console.error('Error al cerrar la sesión:', error);
      throw new Error('No se pudo cerrar la sesión.');
    }
  }


  getUsuarioActual(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => resolve(user));
    });
  }
  
  

  generarHandle(email: string | undefined): string {
    return email ? email.split('@')[0] : 'Usuario';
  }


  async obtenerDatosUsuario(uid: string): Promise<Usuario | null> {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      const usuarioSnapshot = await getDoc(usuarioRef);
      if (usuarioSnapshot.exists()) {
        const datosUsuario = usuarioSnapshot.data() as Usuario;
        datosUsuario.handle = datosUsuario.handle || this.generarHandle(datosUsuario.email);
        return datosUsuario;
      } else {
        console.warn(`El usuario con UID ${uid} no existe.`);
        return null;
      }
    } catch (error) {
      console.error(`Error al obtener datos del usuario con UID ${uid}:`, error);
      throw new Error('Error al obtener datos del usuario.');
    }
  }

  async actualizarUsuario(uid: string, datos: Partial<Usuario>): Promise<void> {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      await updateDoc(usuarioRef, datos);
      this.notificarPerfilActualizado({ uid, ...datos });
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
      throw new Error('No se pudo actualizar el usuario.');
    }
  }

  async esPerfilCompletado(uid: string): Promise<boolean> {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      const usuarioSnapshot = await getDoc(usuarioRef);
      return usuarioSnapshot.exists() && !!usuarioSnapshot.data()?.['perfilCompletado'];
    } catch (error) {
      console.error('Error al verificar si el perfil está completado:', error);
      throw new Error('No se pudo verificar el estado del perfil.');
    }
  }

  async subirImagen(tipo: string, archivo: File): Promise<string> {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `usuarios/${tipo}/${archivo.name}`);
      await uploadBytes(storageRef, archivo);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw new Error('No se pudo subir la imagen.');
    }
  }

  async actualizarPerfil(datosUsuario: Partial<Usuario>): Promise<void> {
    try {
      const usuarioActual = await this.getUsuarioActual();
      if (usuarioActual?.uid) {
        const usuarioRef = doc(this.firestore, `usuarios/${usuarioActual.uid}`);
        datosUsuario.handle = this.generarHandle(datosUsuario.email ?? usuarioActual.email ?? '');
        await updateDoc(usuarioRef, datosUsuario);
        this.notificarPerfilActualizado(datosUsuario);
      } else {
        console.error('No hay usuario autenticado para actualizar el perfil.');
        throw new Error('Usuario no autenticado.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      throw new Error('No se pudo actualizar el perfil.');
    }
  }
}
