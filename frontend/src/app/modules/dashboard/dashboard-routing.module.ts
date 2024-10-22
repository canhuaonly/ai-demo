import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NftComponent } from './pages/nft/nft.component';
import { PodcastComponent } from './pages/podcast/podcast.component';
import { Test0001Component } from './pages/test0001/test0001.component';
import { Test0002Component } from './pages/test0002/test0002.component';
import { Test0003Component } from './pages/test0003/test0003';
import { Test0004Component } from './pages/test0004/test0004.component';
import { Test0005Component } from './pages/test0005/test0005.component';
import { Test0006Component } from './pages/test0006/test0006.component';
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
      { path: 'test0004', component: Test0004Component },
      { path: 'test0005', component: Test0005Component },
      { path: 'test0006', component: Test0006Component },
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
