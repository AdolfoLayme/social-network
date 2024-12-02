import { Component } from '@angular/core';
import { AutenticacionService } from '../../../core/servicios/autenticacion.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-recuperar-clave',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recuperar-clave.component.html',
  styleUrl: './recuperar-clave.component.css'
})
export class RecuperarClaveComponent {
  email: string = ''; // Variable para el correo ingresado por el usuario

  constructor(private authService: AutenticacionService) {}

  enviarRecuperacion() {
    if (this.email.trim() === '') {
      alert('Por favor, ingresa tu correo.');
      return;
    }

    this.authService
      .recuperarContrasena(this.email)
      .then(() => {
        alert('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
        this.email = ''; // Limpia el campo del correo
      })
      .catch((error) => {
        alert('Error al enviar el correo: ' + error.message);
      });
  }

}
