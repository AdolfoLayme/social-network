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
    foto: [''],
    fondo: [''],
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

  async cargarDatosPerfil(): Promise<void> {
    try {
      this.cargando = true;
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const datosUsuario = await this.usuarioService.obtenerDatosUsuario(usuarioActual.uid);
        if (datosUsuario) {
          this.usuario = {
            ...this.usuario, 
            ...datosUsuario, 
            fotoPerfil: datosUsuario.foto || '/assets/icons/icono-perfil.png',
            fondo: datosUsuario.fondo || '/assets/icons/icono-fondo.png',
            handle: datosUsuario.handle || this.usuario.handle || this.usuarioService.generarHandle(usuarioActual.email || ''), 
          };
        } else {
          console.warn('No se pudieron obtener los datos del usuario.');
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      this.cargando = false;
    }
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
