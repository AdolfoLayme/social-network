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

  constructor(
    private authService: UsuarioService,
    private firestore: Firestore,
    private router: Router
  ) {}

  async onRegister() {
    try {
      // Registrar usuario con Firebase Authentication
      const res = await this.authService.register(this.email, this.password);

      // Guardar datos adicionales del usuario en Firestore
      const uid = res.user?.uid;
      if (uid) {
        const usuarioRef = doc(this.firestore, `usuarios/${uid}`);
        await setDoc(usuarioRef, {
          nombre: this.nombre,
          email: this.email,
          createdAt: new Date(),
        });
      }

      // Limpiar formulario
      this.nombre = '';
      this.email = '';
      this.password = '';

      // Redirigir 
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 3000);
    } catch (err) {
      console.error('Error al registrar usuario:', err);
    }
  }
}
