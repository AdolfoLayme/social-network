import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { UsuarioService} from '../../../core/servicios/usuario.service';


@Component({
  selector: 'app-configurar-perfil',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './configurar-perfil.component.html',
  styleUrl: './configurar-perfil.component.css'
})
export class ConfigurarPerfilComponent {
  nombreCompleto: string = '';
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
    'Educación Primaria Intercultural',
    'Matemáticas y Estadística Aplicadas',
    'Enfermería',
    'Psicología',
  ];
  anoAcademicos: string[] = [
    'Primer Año',
    'Segundo Año',
    'Tercer Año',
    'Cuarto Año',
    'Quinto Año',
  ];

  constructor(private usuarioService: UsuarioService) {}

  async ngOnInit() {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        // Obtener datos del usuario desde Firestore
        const datosUsuario = await this.usuarioService.obtenerDatosUsuario(
          usuarioActual.uid
        );
        this.nombreCompleto = datosUsuario?.nombre || 'Sin nombre';
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

  guardarConfiguracion() {
    console.log('Configuración guardada:');
    console.log('Nombre Completo:', this.nombreCompleto);
    console.log('Carrera:', this.carrera);
    console.log('Año Académico:', this.anoAcademico);
    console.log('Foto de Perfil:', this.foto ? 'Cargada' : 'Sin cargar');
  }
}
