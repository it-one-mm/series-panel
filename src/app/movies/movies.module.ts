import { NgModule } from '@angular/core';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieFormComponent } from './movie-form/movie-form.component';
import { ShareModule } from '../shared/modules/share.module';
import { NzSelectModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [MovieListComponent, MovieFormComponent],
  imports: [
    ShareModule,
    MoviesRoutingModule,
    NzSelectModule
  ],
  entryComponents: [MovieFormComponent],
})
export class MoviesModule { }
