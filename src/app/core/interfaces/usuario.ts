export interface Usuario {
    uid?: string; // Identificador único del usuario en Firebase
    nombre?: string; // Nombre completo del usuario
    handle?: string; // Alias o nombre de usuario
    biografia?: string; // Breve descripción o biografía del usuario
    fondo?: string; // URL de la imagen de fondo del perfil
    foto?: string; // URL de la foto de perfil
    publicaciones?: any[]; // Lista de publicaciones asociadas al usuario
    [key: string]: any; // Permitir propiedades adicionales opcionales
  }
  