import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusquedaService } from '../../services/busqueda.service';
import { Usuario } from '../../models/usuario.model';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent implements OnInit {

  public termino: string;

  public usuarios: Usuario[] = [];
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];

  constructor( private activatedRoute: ActivatedRoute,
               private busquedaService: BusquedaService ) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( ({termino}) => {
      this.busquedaGlobal(termino);
    });


  }

  busquedaGlobal(termino: string){
    this.busquedaService.busquedaGlobal(termino).subscribe((resp:any) => {
      this.usuarios = resp.usuarios;
      this.medicos = resp.medicos;
      this.hospitales = resp.hospitales;
    });
  }

}
