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
import { Publicaciones } from '../interfaces/publicaciones';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  constructor(private firestore: Firestore, private usuarioService: UsuarioService) {}

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

  async obtenerPublicaciones(): Promise<Publicaciones[]> {
    try {
        const coleccion = collection(this.firestore, 'publicaciones');
        const consulta = query(coleccion, orderBy('fecha', 'desc'));
        const snapshot = await getDocs(consulta);

        // Mapea las publicaciones
        const publicaciones: Publicaciones[] = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const publicacion = docSnap.data() as Publicaciones;
                publicacion.id = docSnap.id;
                if (publicacion.usuarioUid) {
                    try {
                        const usuarioDatos = await this.usuarioService.obtenerDatosUsuario(publicacion.usuarioUid);
                        publicacion.usuario = usuarioDatos?.nombre || 'Usuario Anónimo';
                        publicacion.usuarioImagen = usuarioDatos?.foto || '/icons/icono-perfil.png';
                    } catch (error) {
                        console.error(`Error al obtener datos del usuario ${publicacion.usuarioUid}:`, error);
                        publicacion.usuario = 'Usuario Anónimo';
                    }
                }
                return publicacion;
            })
        );

        return publicaciones;
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
