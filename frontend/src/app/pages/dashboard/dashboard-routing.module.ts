import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { InterfaceComponent } from './interface/interface.component';
import { CosmosLearnV1Component } from './cosmos-learn-v1/cosmos-learn-v1.component';

export const routes: Routes = [
  { path: '', redirectTo: '/hello', pathMatch: 'full' },
  { path: 'hello', component: HelloComponent },
  { path: 'interface', component: InterfaceComponent },
  { path: 'cosmos_learn_v1', component: CosmosLearnV1Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
