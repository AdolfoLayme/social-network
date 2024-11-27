import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './grupos.component.html',
  styleUrl: './grupos.component.css'
})
export class GruposComponent {
  categorias: string[] = ['Tecnología', 'Arte', 'Deportes', 'Ciencia', 'Entretenimiento'];

  // Grupo que se está creando
  nuevoGrupo = {
    nombre: '',
    descripcion: '',
    categoria: '',
    imagen: ''
  };

  // Lista de grupos existentes
  grupos = [
    {
      nombre: 'Grupo de Tecnología',
      descripcion: 'Discutimos sobre las últimas tendencias tecnológicas.',
      categoria: 'Tecnología',
      imagen: '/assets/default-group.jpg'
    },
    {
      nombre: 'Amantes del Arte',
      descripcion: 'Un espacio para compartir nuestra pasión por el arte.',
      categoria: 'Arte',
      imagen: '/assets/default-group.jpg'
    }
  ];

  // Método para seleccionar una imagen para el grupo
  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const lector = new FileReader();
      lector.onload = () => {
        this.nuevoGrupo.imagen = lector.result as string;
      };
      lector.readAsDataURL(input.files[0]);
    }
  }

  // Método para crear un nuevo grupo
  crearGrupo(): void {
    if (this.nuevoGrupo.nombre.trim() && this.nuevoGrupo.descripcion.trim() && this.nuevoGrupo.categoria) {
      this.grupos.unshift({
        ...this.nuevoGrupo,
        imagen: this.nuevoGrupo.imagen || '/assets/default-group.jpg'
      });
      this.nuevoGrupo = { nombre: '', descripcion: '', categoria: '', imagen: '' }; 
    } else {
      alert('Todos los campos son obligatorios.');
    }
  }

  // Método para unirse a un grupo
  unirseAGrupo(grupo: any): void {
    alert(`Te has unido al grupo: ${grupo.nombre}`);
  }

}
