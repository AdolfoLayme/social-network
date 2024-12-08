import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { PublicacionesService } from '../../../core/servicios/publicaciones.service';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';

@Component({
  selector: 'app-ver-perfil',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule, EditarPerfilComponent],
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent implements OnInit {
  usuario: any = {
    nombre: '',
    handle: '',
    biografia: '',
    fondoPerfil: '/icons/icono-fondo.png',
    fotoPerfil: '/icons/icono-perfil.png',
    publicaciones: [],
  };

  cargando: boolean = false;
  mostrarModal: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private publicacionesService: PublicacionesService
  ) {}

  ngOnInit(): void {
    this.cargarDatosPerfil();
    this.cargarPublicacionesUsuario();
  }

  cargarDatosPerfil(): void {
    this.cargando = true;
    this.usuarioService.getUsuarioActual().then((usuario) => {
      if (usuario?.uid) {
        this.usuarioService.obtenerDatosUsuario(usuario.uid).then((datosUsuario) => {
          this.usuario = { ...this.usuario, ...datosUsuario }; 
          this.cargando = false;
        });
      } else {
        this.cargando = false;
      }
    });
  }

  async cargarPublicacionesUsuario(): Promise<void> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const publicaciones = await this.publicacionesService.obtenerPublicaciones();
        this.usuario.publicaciones = publicaciones.filter(
          (post) => post.usuarioUid === usuarioActual.uid
        ).map((post) => {
          if (post.fecha?.toDate) {
            post.fecha = post.fecha.toDate(); 
          }
          return post;
        });
      }
    } catch (error) {
      console.error('Error al cargar publicaciones del usuario:', error);
    }
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  actualizarDatosPerfil(): void {
    this.cargarDatosPerfil();
    this.cargarPublicacionesUsuario();
  }
  
  
}
