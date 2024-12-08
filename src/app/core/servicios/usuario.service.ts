import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  user,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  DocumentData,
} from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Usuario } from '../interfaces/usuario'; 

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
  public generarHandle(email: string | undefined): string {
    if (!email) return '';
    return email.split('@')[0];
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
      return null;
    }
  }
  
 
  async actualizarUsuario(uid: string, datos: Record<string, any>): Promise<void> {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      await updateDoc(usuarioRef, datos);
    } catch (error) {
      console.error('Error al actualizar datos del usuario:', error);
      throw error;
    }
  }
 
  async esPerfilCompletado(uid: string): Promise<boolean> {
    try {
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      const usuarioSnapshot = await getDoc(usuarioRef);
      return (
        usuarioSnapshot.exists() &&
        (usuarioSnapshot.data()?.['perfilCompletado'] || false)
      );
    } catch (error) {
      console.error('Error al verificar si el perfil está completado:', error);
      throw error;
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
      throw error;
    }
  }
  

  async actualizarPerfil(datosUsuario: Partial<Usuario>): Promise<void> {
    try {
      const usuarioActual = await this.getUsuarioActual();
      if (usuarioActual?.uid) {
        const usuarioRef = doc(this.firestore, `usuarios/${usuarioActual.uid}`);
        datosUsuario.handle = this.generarHandle(datosUsuario.email ?? usuarioActual.email ?? '');
        await updateDoc(usuarioRef, datosUsuario);
      } else {
        console.error('No hay usuario autenticado para actualizar el perfil.');
      }
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      throw error;
    }
  }
}
