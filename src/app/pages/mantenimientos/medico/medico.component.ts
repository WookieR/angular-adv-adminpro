import { Component, OnInit, OnDestroy } from '@angular/core';
import { MedicoService } from '../../../services/medico.service';
import { Medico } from '../../../models/medico.model';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedaService } from '../../../services/busqueda.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImagenService: ModalImagenService,
               private busquedaService: BusquedaService ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe( delay(1000) ).subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe(resp => {
      this.medicos = resp;
      this.cargando = false;
    });
  }

  abrirModal(medico){
    this.modalImagenService.abrirModal('medico', medico._id, medico.img);
  }

  buscar(termino: string){
    console.log(termino);
    if (termino.length === 0){
      return this.cargarMedicos();
    }

    this.busquedaService.buscar('medicos', termino).subscribe( resp => {
      this.medicos = resp;
    });
  }

  borrarMedico(medico: Medico){
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicoService.eliminarMedico(medico._id).subscribe(resp => {
          this.cargarMedicos();
          Swal.fire('Usuario Borrado', `${medico.nombre} fue eliminado correctamente`, 'success');
        });
      }
    });

  }

}
