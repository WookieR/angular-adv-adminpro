import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers:
      {
         'x-token': this.token
      }
    };
  }

  constructor( private http: HttpClient ) {}

  private tranformarUsuarios(resultados: any[]): Usuario[]{
    return resultados.map( user => {
      return new Usuario(user.nombre, user.email, '', user.google, user.role, user.id, user.img);
    });
  }

  private tranformarHospitales(resultados: any[]): Hospital[]{
    return resultados;
  }

  private tranformarMedicos(resultados: any[]): Medico[]{
    return resultados;
  }

  buscar(tipo: 'usuarios'| 'medicos'| 'hospitales', termino: string ){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers).pipe(
      map((resp:any) => {
        switch ( tipo ){
          case 'usuarios':
            return this.tranformarUsuarios(resp.resultados);

          case 'hospitales':
            return this.tranformarHospitales(resp.resultados);

          case 'medicos':
            return this.tranformarMedicos(resp.resultados);
        }
      })
    );
  }

}
