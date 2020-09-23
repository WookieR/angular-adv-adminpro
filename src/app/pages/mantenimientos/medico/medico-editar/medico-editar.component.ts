import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '../../../../services/hospital.service';
import { Hospital } from '../../../../models/hospital.model';
import { MedicoService } from '../../../../services/medico.service';
import { Medico } from '../../../../models/medico.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico-editar',
  templateUrl: './medico-editar.component.html',
  styles: [
  ]
})
export class MedicoEditarComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      this.cargarMedico(id);

    });

    //this.medicoService.obtenerMedicoPorId(  )

    this.medicoForm = this.fb.group({
      nombre: ['', [Validators.required], []],
      hospital: ['' , [Validators.required], []]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe(hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find( hospital => hospital._id === hospitalId);
    });
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales().subscribe( (hospitales: Hospital[])  => {
      this.hospitales = hospitales;
    });
  }

  guardarMedico(){

    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado){
      // Actualizar
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      };

      this.medicoService.actualizarMedico(data).subscribe( resp => {
        Swal.fire('Actualizado', `${nombre} actualizado correctamente`, 'success');
      });
    }else{
      // Crear

      this.medicoService.crearMedico(this.medicoForm.value).subscribe((resp:any) => {
        Swal.fire('Medico Guardado', `${nombre} fue registrado satisfactoriamente`, 'success');
        this.router.navigateByUrl(`/dashboard/medicos/${resp.medico._id}`);
      });
    }
  }

  cargarMedico(id: string){

    if (id === 'nuevo'){
      return;
    }

    this.medicoService.obtenerMedicoPorId(id).pipe(
      delay(100)
    ).subscribe(medico => {

      if(!medico){
        return this.router.navigateByUrl(`/dashboard/medicos`);
      }

      const { nombre, hospital: { _id }} = medico;

      this.medicoSeleccionado = medico;
      this.medicoForm.setValue({ nombre: this.medicoSeleccionado.nombre, hospital: this.medicoSeleccionado.hospital._id });
    }, err => {
      this.router.navigateByUrl(`/dashboard/medicos`);
    });
  }
}
