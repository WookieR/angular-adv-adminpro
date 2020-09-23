import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

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

  constructor(private http: HttpClient) { }

  cargarHospitales(){
    const url = `${base_url}/hospital`;
    return this.http.get<Hospital[]>(url, this.headers ).pipe(
      map ( (resp:any) => {
        return resp.hospitales;
      })
    );
  }

  crearHospital(nombre: string){
    const url = `${base_url}/hospital`;
    return this.http.post(url, {nombre}, this.headers);
  }

  actualizarHospital( id: string, nombre: string ){
    const url = `${base_url}/hospital/${id}`;
    return this.http.put(url, {nombre}, this.headers);
  }

  eliminarHospital( id: string ){
    const url = `${base_url}/hospital/${id}`;
    return this.http.delete(url, this.headers);
  }
}
