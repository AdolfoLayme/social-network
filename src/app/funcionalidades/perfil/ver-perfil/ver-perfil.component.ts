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
    nombre: 'Adolfo',
    handle: 'Adolfo_Bonif',
    fotoPerfil: '/icons/icono-perfil.png',
    fondoPerfil: '/images/fondo-perfil.jpg',
    biografia: 'Estudiante de Ingeniería de Sistemas | Apasionado por la tecnología y el desarrollo de software',
    publicaciones: [
      {
        descripcion: '¡Hola! Esta es mi primera publicación.',
        tiempo: 'Hace 5 minutos',
      },
      {
        descripcion: 'Preparando proyectos para fin de semestre...',
        tiempo: 'Hace 1 hora',
      },
    ],
  };
}