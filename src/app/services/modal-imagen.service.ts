import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment.prod';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {
  private _ocultarModal: boolean = true;
  public tipo: 'usuario'|'hospital'|'medico';
  public id: string;
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal( tipo: 'usuario'|'hospital'|'medico', id: string, img: string = 'no-image'){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    if (img.includes('https')){
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }
  }

  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }
}
