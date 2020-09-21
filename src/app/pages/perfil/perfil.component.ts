import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {
  public profileForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private fileUpload: FileUploadService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nombre: [this.usuario.nombre, [Validators.required], []],
      email: [this.usuario.email, [Validators.required, Validators.email]]
    });
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.profileForm.value).subscribe( resp => {
      const { nombre, email } = this.profileForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;

      Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
    }, err => {
      console.log(err);
      Swal.fire('Error', err.error.error, 'error');
    });
  }

  cambiarImagen(file: File){
    this.imagenSubir = file;

    if (!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();

    reader.readAsDataURL( file );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen(){
    this.fileUpload.actualizarFoto(this.imagenSubir, 'usuario', this.usuario.id).then( img => {
      this.usuario.img = img;
      Swal.fire('Guardado', 'Los cambios fueron guardados', 'success');
    }, err => {
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    });
  }



}
