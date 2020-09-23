import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedaService } from '../../../services/busqueda.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: [
  ]
})
export class UsuarioComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public imgSubs: Subscription;
  public desde = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedaService: BusquedaService,
               private modalImagenService: ModalImagenService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe( delay(1000) ).subscribe(img => this.cargarUsuarios())
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde).subscribe( resp =>{
      this.totalUsuarios = resp.total;
      this.usuarios = resp.usuarios;
      this.usuariosTemp = resp.usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina(valor: number){

    this.desde += valor;

    if (this.desde < 0){
      this.desde = 0;
    }else if (this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string){

    if (termino.length === 0){
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedaService.buscar('usuarios', termino).subscribe( (resp: Usuario[]) => {
      this.usuarios = resp;
    });
  }

  eliminarUsuario(usuario: Usuario){

    if(usuario.id === this.usuarioService.id){
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
    }
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe(resp => {
          this.cargarUsuarios();
          Swal.fire('Usuario Borrado', `${usuario.nombre} fue eliminado correctamente`, 'success');
        });
      }
    });
  }

  cambiarRole(data: Usuario){
    this.usuarioService.guardarUsuario(data).subscribe(resp => {
      console.log(resp);
    });
  }

  abrirModal(usuario: Usuario){
    console.log(usuario);
    this.modalImagenService.abrirModal('usuario', usuario.id, usuario.img);
  }

}
