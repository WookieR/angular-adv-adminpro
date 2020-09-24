import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment.prod';
import { LoginForm } from '../interfaces/login-form.interface';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuario.interface';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  public auth2:any;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get id(): string {
    return this.usuario.id || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  get headers(){
    return {
      headers:
      {
         'x-token': this.token
      }
    };
  }

  crearUsuario ( formData: RegisterForm ){
    return this.http.post(`${base_url}/usuario`, formData).pipe(
      tap( (resp:any) => {
        // localStorage.setItem('token', resp.token );
        // localStorage.setItem('menu', resp.menu );
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string}){
    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuario/${this.id}`, data, this.headers);
  }

  login ( formData: LoginForm ){
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap( (resp:any) => {
        // localStorage.setItem('token', resp.token );
        // localStorage.setItem('menu', resp.menu );
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  loginGoogle ( token: string ){
    return this.http.post(`${base_url}/login/google`, {token}).pipe(
      tap( (resp:any) => {
        // localStorage.setItem('token', resp.token );
        // localStorage.setItem('menu', resp.menu );
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  validarToken(): Observable<boolean>{
    const token = this.token;

    return this.http.get(`${base_url}/login/renew`,
      {
        headers: {
          'x-token': token
        }
      }).pipe(
        map( (resp:any) => {

          const { nombre, email, google, img = '', role, id } = resp.usuario;

          this.usuario = new Usuario(nombre, email, '', google, role, id, img);
          // localStorage.setItem('token', resp.token );
          // localStorage.setItem('menu', resp.menu );
          this.guardarLocalStorage(resp.token, resp.menu);
          return true;
        }),
        catchError( err => of( false )
        )
      );
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    // Borrar Menu

    this.auth2.signOut().then( () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  googleInit(){

    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '596877197043-a9f3g8gdqi6ak13j8escrhbtbr4b35as.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }

  cargarUsuarios(desde: number = 0){
    const url = `${base_url}/usuario?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers).pipe(
      map( resp => {
        const usuarios = resp.usuarios.map( user => new Usuario(user.nombre, user.email, '', user.google, user.role, user.id, user.img) );

        return {
          total: resp.total,
          usuarios
        }
      })
    )
  }

  eliminarUsuario(usuario: Usuario){
    const url = `${base_url}/usuario/${usuario.id}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario){

    return this.http.put(`${base_url}/usuario/${usuario.id}`, usuario, this.headers);
  }

  guardarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu) );
  }
}
