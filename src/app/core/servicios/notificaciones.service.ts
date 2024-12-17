import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc } from '@angular/fire/firestore';
import { Timestamp } from 'firebase/firestore';
import { UsuarioService } from './usuario.service';
import { Notificacion } from '../interfaces/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  
constructor(
  private firestore: Firestore,
  private usuarioService: UsuarioService 
) {}

  async agregarNotificacion(idUsuarioDestino: string, idUsuarioAccion: string, idComentario: string, mensaje: string) {
    const notificacionesRef = collection(this.firestore, 'notificaciones');
    await addDoc(notificacionesRef, {
      idUsuarioDestino,
      idUsuarioAccion,
      idComentario,
      mensaje,
      fecha: Timestamp.now(),
      visto: false
    });
  }

  async obtenerNotificaciones(idUsuarioDestino: string): Promise<Notificacion[]> {
    const notificacionesRef = collection(this.firestore, 'notificaciones');
    const q = query(
      notificacionesRef,
      where('idUsuarioDestino', '==', idUsuarioDestino),
      orderBy('fecha', 'desc')
    );
  
    try {
      const querySnapshot = await getDocs(q);
      const notificaciones: Notificacion[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as Notificacion;
        return {
          ...data,
          id: doc.id, 
        };
      });
      const notificacionesConNombres = await Promise.all(
        notificaciones.map(async (notificacion) => {
          const datosUsuario = await this.usuarioService.obtenerDatosUsuario(notificacion.idUsuarioAccion);
          return {
            ...notificacion,
            nombreUsuarioAccion: datosUsuario?.nombre || 'Usuario desconocido',
          };
        })
      );
  
      return notificacionesConNombres;
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }
  
  async marcarComoVista(idNotificacion: string) {
    const notificacionDoc = doc(this.firestore, `notificaciones/${idNotificacion}`);
    await updateDoc(notificacionDoc, { visto: true });
  }
}
