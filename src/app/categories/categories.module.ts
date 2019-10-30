import { NgModule } from '@angular/core';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { ShareModule } from '../shared/modules/share.module';

@NgModule({
  declarations: [
    CategoryListComponent, 
    CategoryFormComponent,
  ],
  imports: [
    CategoriesRoutingModule,
    ShareModule,
  ],
  entryComponents: [CategoryFormComponent],
})
export class CategoriesModule { }
