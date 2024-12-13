import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../core/servicios/usuario.service';
import { PublicacionesService } from '../../../core/servicios/publicaciones.service';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';


@Component({
  selector: 'app-ver-perfil',
  standalone: true,
  imports: [RouterModule, NgFor, CommonModule, EditarPerfilComponent,],
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent implements OnInit, OnDestroy {
  usuario: any = {
    nombre: '',
    handle: '',
    biografia: '',
    foto: '/icons/icono-perfil.png',
    fondo: '',
    publicaciones: [],
  };

  cargando: boolean = false;
  mostrarModal: boolean = false;
  esPropioPerfil: boolean = true;


  private perfilSubscription: Subscription | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private publicacionesService: PublicacionesService,
    private route: ActivatedRoute 
  ) {}

  ngOnInit(): void {
     this.route.paramMap.subscribe(async (params: ParamMap) => {
      const uid = params.get('uid');
      if (uid) {
        this.esPropioPerfil = false;
        await this.cargarPerfilDeOtroUsuario(uid);
      } else {
        this.esPropioPerfil = true;
        await this.cargarDatosPerfil();
        await this.cargarPublicacionesUsuario();
      }
    });
    this.perfilSubscription = this.usuarioService.perfilActualizado$.subscribe(
      (usuarioActualizado) => {
        if (usuarioActualizado) {
          this.usuario = { ...this.usuario, ...usuarioActualizado };
        }
      }
    );
  }

  async cargarDatosPerfil(): Promise<void> {
    try {
      this.cargando = true;
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const datosUsuario = await this.usuarioService.obtenerDatosUsuario(usuarioActual.uid);
        if (datosUsuario) {
          this.usuario = {
            ...this.usuario,
            ...datosUsuario,
            foto: datosUsuario.foto || '/icons/icono-perfil.png',
            fondo: datosUsuario.fondo || '',
            handle: datosUsuario.handle || this.usuarioService.generarHandle(usuarioActual.email || ''),
          };
        } else {
          console.warn('No se pudieron obtener los datos del usuario.');
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    } finally {
      this.cargando = false;
    }
  }
  async cargarPerfilDeOtroUsuario(uid: string): Promise<void> {
    try {
      this.cargando = true;
      const datosUsuario = await this.usuarioService.obtenerDatosUsuario(uid);
      if (datosUsuario) {
        this.usuario = {
          ...datosUsuario,
          foto: datosUsuario.foto || '/icons/icono-perfil.png',
          fondo: datosUsuario.fondo || '',
          handle: datosUsuario.handle || this.usuarioService.generarHandle(datosUsuario.email || ''),
        };
      } else {
        console.warn(`El usuario con UID ${uid} no existe.`);
      }
    } catch (error) {
      console.error('Error al cargar el perfil de otro usuario:', error);
    } finally {
      this.cargando = false;

    }
  }
  async cargarPublicacionesUsuario(): Promise<void> {
    try {
      const usuarioActual = await this.usuarioService.getUsuarioActual();
      if (usuarioActual?.uid) {
        const publicaciones = await this.publicacionesService.obtenerPublicaciones();
        this.usuario.publicaciones = publicaciones
          .filter((post) => post.usuarioUid === usuarioActual.uid)
          .map((post) => {
            if (post.fecha?.toDate) {
              post.fecha = post.fecha.toDate();
            }
            return post;
          });
      }
    } catch (error) {
      console.error('Error al cargar publicaciones del usuario:', error);
    }
  }
  

  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  actualizarDatosPerfil(): void {
    this.cargarDatosPerfil();
    this.cargarPublicacionesUsuario();
  }

  ngOnDestroy(): void {
    if (this.perfilSubscription) {
      this.perfilSubscription.unsubscribe();
    }
  }
}
