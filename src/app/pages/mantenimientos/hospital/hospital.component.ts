import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedaService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styles: [
  ]
})
export class HospitalComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService) { }

  public imgSubs: Subscription;

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen.pipe( delay(1000) ).subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(hospitales => {
      this.cargando = false;
      this.hospitales = hospitales;
      console.log(this.hospitales);
    });
  }

  guardarCambios(hospital){
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre).
    subscribe(resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    });
  }

  eliminarHospital(hospital){
    this.hospitalService.eliminarHospital(hospital._id).
    subscribe(resp => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success');
    });
  }

  async crearHospitalModal(){
    const {value = ''} = await Swal.fire<string>({
      text: 'Ingrese el nombre del nuevo hospital',
      showCancelButton: true,
      input: 'text',
      inputPlaceholder: 'Ingrese nombre',
      title: 'Crear Hospital'
    });

    if (value.trim().length > 0){
      this.hospitalService.crearHospital(value).subscribe( (resp:any) => {
        this.hospitales.push(resp.hospital);
      });
    }
  }

  abrirModal(hospital){
    this.modalImagenService.abrirModal('hospital', hospital._id, hospital.img);
  }

  buscar(termino: string){
    console.log(termino);
    if (termino.length === 0){
      return this.cargarHospitales();
    }

    this.busquedaService.buscar('hospitales', termino).subscribe( resp => {
      this.hospitales = resp;
    });
  }

}
