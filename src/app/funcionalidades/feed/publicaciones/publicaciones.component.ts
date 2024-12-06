import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PublicacionesService } from '../../../core/servicios/publicaciones.service';
import { UsuarioService } from '../../../core/servicios/usuario.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicaciones.component.html',
  styleUrls: ['./publicaciones.component.css']
})
export class PublicacionesComponent implements OnInit {
  usuario: any = {};
  publicaciones: any[] = [];
  nuevaPublicacion: string = '';
  nuevaImagen: string = '';

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
          fotoPerfil: datosUsuario?.foto || '/icons/icono-perfil.png'
        };
      }
    } catch (error) {
      console.error('Error al cargar el usuario:', error);
    }
  }

  cargarPublicaciones(): void {
    this.publicacionesService.obtenerPublicaciones().then((datos) => {
      this.publicaciones = datos;
    });
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
    if (this.nuevaPublicacion.trim()) {
      const nuevaPub = {
        descripcion: this.nuevaPublicacion,
        imagen: this.nuevaImagen || '',
        usuario: this.usuario.nombre,
        usuarioImagen: this.usuario.fotoPerfil,
        usuarioUid: this.usuario.uid,
        likes: []
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
  }

  agregarMeGusta(publicacion: any): void {
    const usuarioId = this.usuario.uid;
    if (!publicacion.likes.includes(usuarioId)) {
      publicacion.likes.push(usuarioId);
      this.publicacionesService.actualizarPublicacion(publicacion.id, {
        likes: publicacion.likes
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
}