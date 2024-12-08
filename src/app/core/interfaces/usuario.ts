export interface Usuario {
    uid: string;
    nombre: string;
    email?: string;
    foto?: string; 
    handle?: string; 
    biografia?: string; 
    fondo?: string; 
    [key: string]: any; 
  }
  