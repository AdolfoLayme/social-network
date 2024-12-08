import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../../core/servicios/publicaciones.service';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { ComentariosComponent } from '../comentarios/comentarios.component';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, ComentariosComponent],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css'],
})
export class PublicacionesComponent implements OnInit {
  usuario: any = {};
  publicaciones: any[] = [];
  nuevaPublicacion: string = '';
  nuevaImagen: string = '';
  comentariosAbiertos: { [id: string]: boolean } = {}; 

  constructor(
    private publicacionesService: PublicacionesService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarPublicaciones();
  }

  async cargarUsuario(): Promise<void> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const datosUsuario = await this.usuarioService.obtenerDatosUsuario(
          usuarioActual.uid
        );
        this.usuario = {
          uid: usuarioActual.uid,
          nombre: datosUsuario?.nombre || 'Usuario Anónimo',
          fotoPerfil: datosUsuario?.foto || '/icons/icono-perfil.png',
        };
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  async cargarPublicaciones(): Promise<void> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const datosUsuario = await this.usuarioService.obtenerDatosUsuario(usuarioActual.uid);
        const publicaciones = await this.publicacionesService.obtenerPublicaciones();
  
        this.publicaciones = publicaciones.map((post) => {
          if (post.usuarioUid === usuarioActual.uid) {
            // Actualiza dinámicamente el nombre del usuario en las publicaciones
            post.usuario = datosUsuario?.nombre || 'Usuario Anónimo';
          }
          return post;
        });
      }
    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    }
  }
  

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const lector = new FileReader();
      lector.onload = () => {
        this.nuevaImagen = lector.result as string;
      };
      lector.readAsDataURL(input.files[0]);
    }
  }

  agregarPublicacion(): void {
    if (!this.nuevaPublicacion.trim()) {
      console.warn('El campo de publicación está vacío.');
      return;
    }

    if (!this.usuario.nombre || !this.usuario.uid) {
      console.error('No se puede agregar publicación sin un usuario válido.');
      return;
    }

    const nuevaPub = {
      descripcion: this.nuevaPublicacion,
      imagen: this.nuevaImagen || '',
      usuario: this.usuario.nombre,
      usuarioImagen: this.usuario.fotoPerfil,
      usuarioUid: this.usuario.uid,
      fecha: new Date(),
      likes: [],
    };

    this.publicacionesService
      .agregarPublicacion(nuevaPub)
      .then(() => {
        this.nuevaPublicacion = '';
        this.nuevaImagen = '';
        this.cargarPublicaciones();
      })
      .catch((error) => console.error('Error al agregar publicación:', error));
  }

  agregarMeGusta(publicacion: any): void {
    const usuarioId = this.usuario.uid;
    if (!publicacion.likes.includes(usuarioId)) {
      publicacion.likes.push(usuarioId);
      this.publicacionesService.actualizarPublicacion(publicacion.id, {
        likes: publicacion.likes,
      });
    }
  }

  eliminarPublicacion(publicacionId: string): void {
    this.publicacionesService.eliminarPublicacion(publicacionId).then(() => {
      this.cargarPublicaciones();
    });
  }

  esAutorPublicacion(publicacion: any): boolean {
    return publicacion.usuarioUid === this.usuario.uid;
  }

  toggleComentarios(id: string): void {
    this.comentariosAbiertos[id] = !this.comentariosAbiertos[id];
  }
}
