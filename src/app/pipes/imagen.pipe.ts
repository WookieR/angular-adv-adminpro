import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(imagen: string, tipo: 'usuario'|'medico'|'hospital'): unknown {
    if (!imagen){
      return `${base_url}/upload/${tipo}/no-image`;
    } else if (imagen.includes('https')){
      return imagen;
    } else if (imagen){
      return `${base_url}/upload/${tipo}/${imagen}`;
    } else{
      return `${base_url}/upload/${tipo}/no-image`;
    }
  }

}
