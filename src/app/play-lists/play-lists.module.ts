import { NgModule } from '@angular/core';

import { PlayListsRoutingModule } from './play-lists-routing.module';
import { PlayListFormComponent } from './play-list-form/play-list-form.component';
import { PlayListListComponent } from './play-list-list/play-list-list.component';
import { ShareModule } from '../shared/modules/share.module';
import { NzSelectModule } from 'ng-zorro-antd';


@NgModule({
  declarations: [PlayListFormComponent, PlayListListComponent],
  imports: [
    ShareModule,
    PlayListsRoutingModule,
    NzSelectModule,
  ],
  entryComponents: [PlayListFormComponent],
})
export class PlayListsModule { }
