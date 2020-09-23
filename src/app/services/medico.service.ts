import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Medico } from '../models/medico.model';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers(): any{
    return {
      headers:
      {
         'x-token': this.token
      }
    };
  }

  constructor( private http: HttpClient) { }

  cargarMedicos(){
    const url = `${base_url}/medico`;
    return this.http.get<Medico[]>(url, this.headers ).pipe(
      map ( (resp:any) => {
        return resp.medicos;
      })
    );
  }

  crearMedico(medico: {nombre: string, hospital: string}){
    const url = `${base_url}/medico`;
    return this.http.post(url, medico, this.headers);
  }

  actualizarMedico( medico: Medico ){
    const url = `${base_url}/medico/${medico._id}`;
    return this.http.put(url, medico, this.headers);
  }

  eliminarMedico( id: string ){
    const url = `${base_url}/medico/${id}`;
    return this.http.delete(url, this.headers);
  }

  obtenerMedicoPorId(id: string){
    const url = `${base_url}/medico/${id}`;
    return this.http.get(url, this.headers).pipe(
      map( (resp:any) => {
        return resp.medico;
      })
    );

  }
}
