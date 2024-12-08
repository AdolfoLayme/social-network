import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/servicios/usuario.service';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
})
export class EditarPerfilComponent implements OnInit {
  @Input() usuario: any;
  @Output() cerrar = new EventEmitter<void>();

  formularioPerfil: FormGroup;
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService) {
    this.formularioPerfil = this.fb.group({
      nombre: ['', [Validators.required]],
      biografia: ['', [Validators.required, Validators.maxLength(160)]],
      foto: [''],
      fondo: [''],
    });
  }

  async ngOnInit() {
    const usuarioActual = await this.usuarioService.getUsuarioActual();
    if (usuarioActual?.uid) {
      this.usuario = {
        uid: usuarioActual.uid,
        nombre: usuarioActual.displayName || 'Usuario Anónimo',
      };
      const datosUsuario = await this.usuarioService.obtenerDatosUsuario(usuarioActual.uid);
      if (datosUsuario) {
        this.formularioPerfil.patchValue(datosUsuario);
      }
    } else {
      console.error('No hay usuario autenticado.');
    }
  }
  

  actualizarFotoPerfil(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formularioPerfil.patchValue({ foto: reader.result });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  actualizarFondo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formularioPerfil.patchValue({ fondo: reader.result });
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  
  
  

  async guardarCambios() {
    if (this.formularioPerfil.valid && this.usuario?.uid) {
      this.cargando = true; 
      try {
        const datosActualizados = this.formularioPerfil.value; 
        await this.usuarioService.actualizarUsuario(this.usuario.uid, datosActualizados);
        this.usuario = { ...this.usuario, ...datosActualizados };
  
        console.log('Cambios guardados con éxito en Firestore');
        alert('Cambios guardados con éxito.');
        this.cerrar.emit(this.usuario); 
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('No se pudo actualizar el perfil.');
      } finally {
        this.cargando = false;
      }
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
  
  
  

  cancelar(): void {
    this.cerrar.emit();
  }
}