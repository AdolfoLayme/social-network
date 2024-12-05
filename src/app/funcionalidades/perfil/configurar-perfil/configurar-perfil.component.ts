import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configurar-perfil',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './configurar-perfil.component.html',
  styleUrls: ['./configurar-perfil.component.css'],
})
export class ConfigurarPerfilComponent {
  nombreCompleto = '';
  carrera = '';
  anoAcademico = '';
  foto: string | null = null;

  carreras = [
    'Ingeniería de Sistemas',
    'Ingeniería Civil',
    'Ingeniería Ambiental',
    'Ingeniería Agroindustrial',
    'Administración de Empresas',
    'Contabilidad',
    'Educación Primaria Intercultural',
    'Matemáticas y Estadística Aplicadas',
    'Enfermería',
    'Psicología',
  ];

  anoAcademicos = [
    'Primer Año',
    'Segundo Año',
    'Tercer Año',
    'Cuarto Año',
    'Quinto Año',
  ];

  constructor(
    private usuarioService: UsuarioService,
    private firestore: Firestore,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const docRef = doc(this.firestore, `usuarios/${usuarioActual.uid}`);
        const datosDoc = await getDoc(docRef);

        if (datosDoc.exists()) {
          const datosUsuario = datosDoc.data();
          this.nombreCompleto = datosUsuario['nombre'] || usuarioActual.displayName || '';
          this.carrera = datosUsuario['carrera'] || '';
          this.anoAcademico = datosUsuario['anoAcademico'] || '';
          this.foto = datosUsuario['foto'] || null;
        } else {
          this.nombreCompleto = usuarioActual.displayName || '';
        }
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    }
  }

  seleccionarFoto() {
    const inputElement = document.getElementById(
      'input-foto-perfil'
    ) as HTMLInputElement;
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

  async guardarConfiguracion() {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const docRef = doc(this.firestore, `usuarios/${usuarioActual.uid}`);
        await setDoc(docRef, {
          nombre: this.nombreCompleto,
          carrera: this.carrera,
          anoAcademico: this.anoAcademico,
          foto: this.foto,
          perfilCompletado: true,
          updatedAt: new Date(),
        });

        console.log('Datos guardados exitosamente en Firestore');
        this.router.navigate(['/feed']);
      } else {
        console.error('No se encontró un usuario autenticado');
      }
    } catch (error) {
      console.error('Error al guardar los datos en Firestore:', error);
    }
  }
}
