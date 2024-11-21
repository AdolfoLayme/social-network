import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';



@Component({
  selector: 'app-configurar-perfil',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './configurar-perfil.component.html',
  styleUrl: './configurar-perfil.component.css'
})
export class ConfigurarPerfilComponent {
  nombre: string = '';
  apellido: string = '';
  carrera: string = '';
  anoAcademico: string = '';
  fotoPerfil: string | ArrayBuffer | null = null; // Para mostrar la imagen

  carreras: string[] = [
    'Ingeniería de Sistemas',
    'Ingeniería Civil',
    'Ingeniería Ambiental',
    'Ingeniería Agroindustrial',
    'Administración de Empresas',
    'Contabilidad',
    'Educación Primaria Interculrural',
    'Matemáticas y Estadística Aplicadas',
    'Enfermeía',
    'Psicología',
  ];
  anoAcademicos: string[] = [
    'Primer Año',
    'Segundo Año',
    'tercer Año',
    'Cuarto Año',
    'Quinto Año'
  ]

  cambiarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfil = reader.result; // Convertir la imagen a base64
      };
      reader.readAsDataURL(file);
    }
  }

  guardarConfiguracion() {
    console.log('Configuración guardada:');
    console.log('Nombre:', this.nombre);
    console.log('Apellido:', this.apellido);
    console.log('Carrera:', this.carrera);
    console.log('Año Académico:', this.anoAcademico);
  }

}
