import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  constructor(private firestore: Firestore) {}

  async agregarPublicacion(publicacion: any): Promise<void> {
    try {
      const coleccion = collection(this.firestore, 'publicaciones');
      await addDoc(coleccion, {
        ...publicacion,
        fecha: new Date()
      });
    } catch (error) {
      console.error('Error al agregar la publicación:', error);
    }
  }

  async obtenerPublicaciones(): Promise<any[]> {
    try {
      const coleccion = collection(this.firestore, 'publicaciones');
      const consulta = query(coleccion, orderBy('fecha', 'desc'));
      const snapshot = await getDocs(consulta);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
      return [];
    }
  }

  async actualizarPublicacion(id: string, datos: any): Promise<void> {
    try {
      const referenciaDoc = doc(this.firestore, `publicaciones/${id}`);
      await updateDoc(referenciaDoc, datos);
    } catch (error) {
      console.error('Error al actualizar publicación:', error);
    }
  }

  async eliminarPublicacion(id: string): Promise<void> {
    try {
      const referenciaDoc = doc(this.firestore, `publicaciones/${id}`);
      await deleteDoc(referenciaDoc);
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
    }
  }
}
