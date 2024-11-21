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
  foto: string | null = null; 

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

  seleccionarFoto() {
    const inputElement = document.getElementById('input-foto-perfil') as HTMLInputElement;
    inputElement.click(); 
  }

  subirFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.foto = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  guardarConfiguracion() {
    console.log('Configuración guardada:');
    console.log('Nombre:', this.nombre);
    console.log('Apellido:', this.apellido);
    console.log('Carrera:', this.carrera);
    console.log('Año Académico:', this.anoAcademico);
    console.log('Foto de Perfil:', this.foto ? 'Cargada' : 'Sin cargar');
  }

}
