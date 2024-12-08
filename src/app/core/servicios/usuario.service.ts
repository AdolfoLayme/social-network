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
import { BehaviorSubject } from 'rxjs'; // Importación necesaria
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private perfilActualizadoSubject = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizadoSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {}

  /** Notificar que el perfil fue actualizado */
  notificarPerfilActualizado(): void {
    this.perfilActualizadoSubject.next(true);
  }

  /** Registro de usuarios */
  register(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /** Inicio de sesión */
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /** Cerrar sesión */
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Sesión cerrada con éxito.');
    } catch (error) {
      console.error('Error al cerrar la sesión:', error);
      throw new Error('No se pudo cerrar la sesión.');
    }
  }

  /** Obtener el usuario actual */
  getUsuarioActual(): Promise<User | null> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => resolve(user));
    });
  }

  /** Generar un handle a partir del email */
  generarHandle(email: string | undefined): string {
    return email ? email.split('@')[0] : 'Usuario';
  }

  /** Obtener datos del usuario por UID */
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

  /** Actualizar datos del usuario */
  async actualizarUsuario(uid: string, datos: Partial<Usuario>): Promise<void> {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      await updateDoc(usuarioRef, datos);
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
      throw new Error('No se pudo actualizar el usuario.');
    }
  }

  /** Verificar si el perfil está completado */
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

  /** Subir una imagen al almacenamiento de Firebase */
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

  /** Actualizar el perfil con datos nuevos */
  async actualizarPerfil(datosUsuario: Partial<Usuario>): Promise<void> {
    try {
      const usuarioActual = await this.getUsuarioActual();
      if (usuarioActual?.uid) {
        const usuarioRef = doc(this.firestore, `usuarios/${usuarioActual.uid}`);
        datosUsuario.handle = this.generarHandle(datosUsuario.email ?? usuarioActual.email ?? '');
        await updateDoc(usuarioRef, datosUsuario);

        // Notificar que el perfil fue actualizado
        this.notificarPerfilActualizado();
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
