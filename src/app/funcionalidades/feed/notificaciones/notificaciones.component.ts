import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './notificaciones.component.html',
  styleUrl: './notificaciones.component.css'
})
export class NotificacionesComponent {
// Filtros de notificaciones
filtros: string[] = ['Todas', 'Verificadas', 'Menciones'];
filtroSeleccionado: string = 'Todas';

// Lista de notificaciones
notificaciones = [
  {
    titulo: 'SpaceX lanzó una nueva misión',
    descripcion: 'Starlink Mission en vivo ahora.',
    icono: '/assets/notificacion1.jpg',
    fecha: 'Hace 10 minutos',
    tipo: 'Verificadas'
  },
  {
    titulo: 'Nueva mención',
    descripcion: 'Te mencionaron en un comentario.',
    icono: '/assets/notificacion2.jpg',
    fecha: 'Hace 1 hora',
    tipo: 'Menciones'
  },
  {
    titulo: 'Solicitud de amistad',
    descripcion: 'Tienes una nueva solicitud de amistad.',
    icono: '/assets/notificacion3.jpg',
    fecha: 'Hace 2 horas',
    tipo: 'Todas'
  }
];

// Notificaciones filtradas
notificacionesFiltradas = this.notificaciones;

// Filtrar notificaciones
filtrarNotificaciones(filtro: string): void {
  this.filtroSeleccionado = filtro;
  this.notificacionesFiltradas =
    filtro === 'Todas'
      ? this.notificaciones
      : this.notificaciones.filter((notificacion) => notificacion.tipo === filtro);
}

// Marcar una notificación como leída
marcarComoLeida(notificacion: any): void {
  alert(`Notificación "${notificacion.titulo}" marcada como leída.`);

}
}
