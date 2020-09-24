import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

import { UsuarioComponent } from './mantenimientos/usuario/usuario.component';
import { HospitalComponent } from './mantenimientos/hospital/hospital.component';
import { MedicoComponent } from './mantenimientos/medico/medico.component';
import { MedicoEditarComponent } from './mantenimientos/medico/medico-editar/medico-editar.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard } from '../guards/admin.guard';

const childRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
  { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress' } },
  { path: 'grafica1',  component: Grafica1Component, data: { titulo: 'Grafica' } },
  { path: 'account-settings',  component: AccountSettingsComponent, data: { titulo: 'Ajustes' } },
  { path: 'promesas',  component: PromesasComponent, data: { titulo: 'Promesas' } },
  { path: 'rxjs',  component: RxjsComponent, data: { titulo: 'RxJs' } },
  { path: 'perfil',  component: PerfilComponent, data: { titulo: 'Perfil' } },

  // Mantenimientos
  { path: 'usuarios', canActivate: [AdminGuard],  component: UsuarioComponent, data: { titulo: 'Mantenimiento de usuarios' } },
  { path: 'hospitales',  component: HospitalComponent, data: { titulo: 'Mantenimiento de hospitales' } },
  { path: 'medicos',  component: MedicoComponent, data: { titulo: 'Mantenimiento de medicos' } },
  { path: 'medicos/:id',  component: MedicoEditarComponent, data: { titulo: 'Mantenimiento de medicos' } },

  // Busqueda
  { path: 'busqueda/:termino',  component: BusquedaComponent, data: { titulo: 'Busqueda Global' } }
];

@NgModule({
  declarations: [ ],
  imports: [ RouterModule.forChild(childRoutes) ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
