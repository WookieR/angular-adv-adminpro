import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment.prod';
import { LoginForm } from '../interfaces/login-form.interface';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2:any;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone) {
    this.googleInit();
  }

  crearUsuario ( formData: RegisterForm ){
    return this.http.post(`${base_url}/usuario`, formData).pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token );
      })
    );
  }

  login ( formData: LoginForm ){
    return this.http.post(`${base_url}/login`, formData).pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token );
      })
    );
  }

  loginGoogle ( token: string ){
    return this.http.post(`${base_url}/login/google`, {token}).pipe(
      tap( (resp:any) => {
        localStorage.setItem('token', resp.token );
      })
    );
  }

  validarToken(): Observable<boolean>{
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`,
      {
        headers: {
          'x-token': token
        }
      }).pipe(
        tap( (resp:any) => {
          localStorage.setItem('token', resp.token );
        }),
        map( resp => {
          return true;
        }),
        catchError( err => of( false )
        )
      );
  }

  logout(){
    localStorage.removeItem('token');
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
}
