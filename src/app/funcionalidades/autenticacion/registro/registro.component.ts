import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/servicios/usuario.service'; 
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';

  mensajeModal: string = '';
  tipoMensaje: 'error' | 'exito' | '' = ''; 
  cargando: boolean = false; 
  mostrarModal: boolean = false; 

  constructor(private authService: UsuarioService, private firestore: Firestore, private router: Router) {}

  async onRegister() {
    this.cargando = true; 
    try {
      // Registrar usuario con Firebase Authentication
      const res = await this.authService.register(this.email, this.password);
      // Guardar datos adicionales del usuario en Firestore
      const uid = res.user?.uid;
      const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
      await setDoc(usuarioRef, {
        nombre: this.nombre,
        email: this.email,
        createdAt: new Date(),
      });

      this.mensajeModal = 'Usuario registrado exitosamente.';
      this.tipoMensaje = 'exito';
      this.mostrarModal = true;
      // Limpiar formulario
      this.nombre = '';
      this.email = '';
      this.password = '';
      this.cargando = false;
      // Redirigir después de mostrar el mensaje de éxito
      setTimeout(() => {
        this.mostrarModal = false;
        this.router.navigate(['/home']);
      }, 3000);
    } catch (err: any) {
      // Configurar el modal de error
      this.mensajeModal = `Error al registrar usuario: ${err.message}`;
      this.tipoMensaje = 'error';
      this.mostrarModal = true;
      this.cargando = false;

      // Ocultar el mensaje de error 
      setTimeout(() => {
        this.mostrarModal = false;
      }, 3000);
    }
  }
}
