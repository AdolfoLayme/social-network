import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [NgFor, CommonModule, NgClass],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})

export class FeedComponent {
  //simulacion de usuario
  usuario = {
    nombre: 'Adolfo',
    handle: 'Adolfo_Bonif',
    fotoPerfil: '/icons/icono-perfil.png',
  };

  publicaciones = [
    {
      usuario: 'Adolfo Layme',
      usuarioImagen: '/icons/icono-perfil.png',
      imagen: 'assets/post1.jpg',
      descripcion: '¡Hola! Esta es mi primera publicación.',
      tiempo: 'Hace 5 minutos',
    },
    {
      usuario: 'Estudiante Ingeniería',
      usuarioImagen: '/icons/icono-perfil.png',
      imagen: 'assets/post2.jpg',
      descripcion: 'Preparando proyectos para fin de semestre...',
      tiempo: 'Hace 1 hora', 
    },
    {
      usuario: 'Otro Usuario',
      usuarioImagen: '/icons/icono-perfil.png',
      imagen: 'assets/post3.jpg',
      descripcion: '¿Alguien sabe cómo resolver este problema?',
      tiempo: 'Hace 2 horas', 
    },
  ];


}
