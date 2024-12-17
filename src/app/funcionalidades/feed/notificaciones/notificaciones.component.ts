import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificacionesService } from '../../../core/servicios/notificaciones.service';
import { UsuarioService } from '../../../core/servicios/usuario.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent {
notificaciones: any[] = [];
idUsuarioActual = 'id-usuario-actual'; 

constructor(
  private notificacionesService: NotificacionesService,
  private usuarioService: UsuarioService 
) {}

async ngOnInit() {
  try {
    const usuarioActual = await this.usuarioService.getUsuarioActual();
    if (usuarioActual?.uid) {
      this.idUsuarioActual = usuarioActual.uid;
      await this.cargarNotificaciones();
    }
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error);
  }
}

async cargarNotificaciones() {
  try {
    this.notificaciones = await this.notificacionesService.obtenerNotificaciones(this.idUsuarioActual);
    console.log('Notificaciones cargadas:', this.notificaciones);
  } catch (error) {
    console.error('Error al cargar notificaciones:', error);
  }
}

async marcarComoVista(idNotificacion: string) {
  try {
    await this.notificacionesService.marcarComoVista(idNotificacion);
    this.cargarNotificaciones();
  } catch (error) {
    console.error('Error al marcar como vista:', error);
  }
}
}
