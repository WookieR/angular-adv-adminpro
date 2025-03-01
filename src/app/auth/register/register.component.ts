import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css'
  ]
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Wok', [Validators.required, Validators.minLength(3)] ],
    email: ['wok@gmail.com', [Validators.required, Validators.email] ],
    password: ['123456', [Validators.required] ],
    password2: ['123456', [Validators.required] ],
    terminos: [ true, [Validators.required], []]

  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  crearUsuario(): void{
    this.formSubmitted = true;
    if (this.registerForm.invalid){
      return;
    }

    // REALIZAR POSTEO
    this.usuarioService.crearUsuario(this.registerForm.value).subscribe(resp => {
      this.router.navigateByUrl('/');
    }, err => {
      Swal.fire('Error', err.error.error, 'error' );
      console.warn(err.error.error);
    });
  }

  campoNoValido(campo: string): boolean{

    if (this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    } else{
      return false;
    }

  }

  aceptaTerminos(): boolean{
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  passwordsNoValidos(): boolean{
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ( (pass1 !== pass2) && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  passwordsIguales( pass1: string, pass2: string ){
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      } else{
        pass2Control.setErrors({ noEsIgual: true});
      }
    };
  }

}
