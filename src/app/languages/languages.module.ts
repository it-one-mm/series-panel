import { NgModule } from '@angular/core';

import { LanguagesRoutingModule } from './languages-routing.module';
import { LanguageFormComponent } from './language-form/language-form.component';
import { LanguageListComponent } from './language-list/language-list.component';
import { ShareModule } from '../shared/modules/share.module';


@NgModule({
  declarations: [LanguageFormComponent, LanguageListComponent],
  imports: [
    ShareModule,
    LanguagesRoutingModule
  ],
  entryComponents: [LanguageFormComponent],
})
export class LanguagesModule { }
