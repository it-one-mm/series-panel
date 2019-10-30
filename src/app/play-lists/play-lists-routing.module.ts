import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayListListComponent } from './play-list-list/play-list-list.component';


const routes: Routes = [
  { 
    path: '', 
    component: PlayListListComponent, 
    data: { title: 'PlayLists' } 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayListsRoutingModule { }
