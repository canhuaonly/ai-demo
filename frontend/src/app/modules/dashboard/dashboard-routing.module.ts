import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NftComponent } from './pages/nft/nft.component';
import { PodcastComponent } from './pages/podcast/podcast.component';
import { Test0001Component } from './pages/test0001/test0001';
import { Test0002Component } from './pages/test0002/test0002';
import { Test0003Component } from './pages/test0003/test0003';
import { CosmosLearnV1Component } from './pages/cosmos-learn-v1/cosmos-learn-v1.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'nfts', pathMatch: 'full' },
      { path: 'nfts', component: NftComponent },
      { path: 'podcast', component: PodcastComponent },
      { path: 'test0001', component: Test0001Component },
      { path: 'test0002', component: Test0002Component },
      { path: 'test0003', component: Test0003Component },
      { path: 'cosmos-learn-v1', component: CosmosLearnV1Component },
      { path: '**', redirectTo: 'error/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
