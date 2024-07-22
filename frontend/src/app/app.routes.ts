import { Routes } from '@angular/router';
import { HelloComponent } from './pages/dashboard/hello/hello.component';
import { InterfaceComponent } from './pages/dashboard/interface/interface.component';
import { CosmosLearnV1Component } from './pages/dashboard/cosmos-learn-v1/cosmos-learn-v1.component';
import { AqviewComponent } from './pages/dialogue/aqview/aqview.component';



export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/hello' },
    { path: 'hello', component: HelloComponent },
    { path: 'interface', component: InterfaceComponent },
    { path: 'aqview', component: AqviewComponent },
    { path: 'cosmos_learn_v1', component: CosmosLearnV1Component }
  ];