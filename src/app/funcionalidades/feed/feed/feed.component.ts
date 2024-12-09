import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit, OnDestroy {
  usuario = {
    nombre: '',
    handle: '',
    foto: '/icons/icono-perfil.png',
  };

  menuVisible: boolean = false;
  private perfilSubscription: Subscription | null = null;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.perfilSubscription = this.usuarioService.perfilActualizado$.subscribe((usuarioActualizado) => {
      if (usuarioActualizado) {
        this.usuario = { ...this.usuario, ...usuarioActualizado }; 
      }
    });
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
            foto: datosUsuario.foto || '/icons/icono-perfil.png',
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    const menuElement = document.querySelector('.menu-opciones-usuario');
    const fotoUsuarioElement = document.querySelector('.foto-usuario');

    if (
      this.menuVisible &&
      menuElement &&
      !menuElement.contains(clickedElement) &&
      fotoUsuarioElement &&
      !fotoUsuarioElement.contains(clickedElement)
    ) {
      this.menuVisible = false; 
    }
  }

  async cerrarSesion(): Promise<void> {
    try {
      await this.usuarioService.logout();
      this.router.navigate(['/home']); 
    } catch (error) {
      console.error('Error al intentar cerrar la sesión:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.perfilSubscription) {
      this.perfilSubscription.unsubscribe();
    }
  }
}
