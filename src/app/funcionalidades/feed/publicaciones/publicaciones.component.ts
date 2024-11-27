import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent {
  usuario = {
    nombre: 'Adolfo',
    handle: 'Adolfo_Bonif',
    fotoPerfil: '/icons/icono-perfil.png',
  };

  publicaciones = [
    { usuario: 'Adolfo Layme', usuarioImagen: '/icons/icono-perfil.png', imagen: 'assets/post1.jpg', descripcion: '¡Hola! Esta es mi primera publicación.', tiempo: 'Hace 5 minutos' },
    { usuario: 'Estudiante Ingeniería', usuarioImagen: '/icons/icono-perfil.png', imagen: 'assets/post2.jpg', descripcion: 'Preparando proyectos para fin de semestre...', tiempo: 'Hace 1 hora' },
    { usuario: 'Otro Usuario', usuarioImagen: '/icons/icono-perfil.png', imagen: 'assets/post3.jpg', descripcion: '¿Alguien sabe cómo resolver este problema?', tiempo: 'Hace 2 horas' },
  ];

  nuevaPublicacion: string = '';
  nuevaImagen: string = '';

  seleccionarImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const lector = new FileReader();
      lector.onload = () => {
        this.nuevaImagen = lector.result as string;
      };
      lector.readAsDataURL(input.files[0]);
    }
  }

  agregarPublicacion(): void {
    if (this.nuevaPublicacion.trim()) {
      this.publicaciones.unshift({
        usuario: this.usuario.nombre,
        usuarioImagen: this.usuario.fotoPerfil,
        imagen: this.nuevaImagen || '',
        descripcion: this.nuevaPublicacion,
        tiempo: 'Hace un momento',
      });
      this.nuevaPublicacion = '';
      this.nuevaImagen = '';
    }
  }

}
