import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, orderBy } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms'; 
import { UsuarioService } from '../../../core/servicios/usuario.service';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.css'],
})
export class ComentariosComponent implements OnInit {
  @Input() publicacionId!: string; 
  comentarios: any[] = [];
  nuevoComentario: string = '';
  usuario: any = {}; 

  constructor(private firestore: Firestore, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarComentarios();
  }

  async cargarUsuario(): Promise<void> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const datosUsuario = await this.usuarioService.obtenerDatosUsuario(usuarioActual.uid);
        this.usuario = {
          uid: usuarioActual.uid,
          nombre: datosUsuario?.nombre || 'Usuario Anónimo',
        };
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  async cargarComentarios(): Promise<void> {
    try {
      const coleccion = collection(this.firestore, `publicaciones/${this.publicacionId}/comentarios`);
      const consulta = query(coleccion, orderBy('fecha', 'desc')); 
      const snapshot = await getDocs(consulta);
      this.comentarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
    }
  }

  async agregarComentario(): Promise<void> {
    if (!this.nuevoComentario.trim()) return;

    try {
      const coleccion = collection(this.firestore, `publicaciones/${this.publicacionId}/comentarios`);
      await addDoc(coleccion, {
        contenido: this.nuevoComentario,
        fecha: new Date(),
        usuario: this.usuario.nombre,
      });
      this.nuevoComentario = '';
      this.cargarComentarios();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
    }
  }
}
