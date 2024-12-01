import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ver-perfil',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule],
  templateUrl: './ver-perfil.component.html',
  styleUrl: './ver-perfil.component.css'
})
export class VerPerfilComponent {
  usuario = {
    nombre: 'Adolfo Bonif',
    handle: 'Adolfo_Bonif',
    biografia: 'Estudiante de Ingeniería de Sistemas | Apasionado por la tecnología y el desarrollo de software',
    fondoPerfil: '/icons/icono-perfil.png', // Ruta de la imagen de fondo
    fotoPerfil: '/icons/icono-perfil.png', // Ruta de la imagen de perfil
    publicaciones: [
      {
        descripcion: '¡Hola! Esta es mi primera publicación.',
        tiempo: 'Hace 5 minutos',
        imagen: '/icons/icono-perfil.png' // Ruta de la imagen opcional del post
      },
      {
        descripcion: 'Preparando proyectos para fin de semestre...',
        tiempo: 'Hace 1 hora',
        imagen: null // Sin imagen para esta publicación
      }
    ]
  };

  // Método para editar perfil (opcional, puedes implementarlo en el futuro)
  editarPerfil() {
    console.log('Editar perfil clicado');
  }
}