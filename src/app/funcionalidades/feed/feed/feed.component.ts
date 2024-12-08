import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Usuario } from '../../../core/interfaces/usuario';


@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})

export class FeedComponent {
  usuario = {
    nombre: '',
    handle: '',
    fotoPerfil: '/icons/icono-perfil.png',
  };

  menuVisible: boolean = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  async cargarUsuario(): Promise<void> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const datosUsuario = await this.usuarioService.obtenerDatosUsuario(usuarioActual.uid);
        if (datosUsuario) {
          this.usuario = {
            ...this.usuario,
            nombre: datosUsuario.nombre || 'Usuario Anónimo',
            handle: datosUsuario.handle || this.usuarioService.generarHandle(usuarioActual.email || undefined),
            fotoPerfil: datosUsuario.foto || '/icons/icono-perfil.png',
          };
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  async cerrarSesion(): Promise<void> {
    try {
      await this.usuarioService.logout();
      this.router.navigate(['/home']); // Redirige al usuario a la página de inicio de sesión.
    } catch (error) {
      console.error('Error al intentar cerrar la sesión:', error);
    }
  }
}