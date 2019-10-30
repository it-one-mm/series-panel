import { Component, OnInit } from '@angular/core';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { CategoryId, CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.less']
})
export class CategoryListComponent implements OnInit {

  isSpinning = false;
  categories: CategoryId[] = [];

  constructor(
    private drawer: NzDrawerService,
    private categoryService: CategoryService,
    private message: NzMessageService) { }

  ngOnInit() {
    this.isSpinning = true;
    this.categoryService.getAll()
      .subscribe(
        categories => { 
          this.categories = categories;
          this.isSpinning = false;
        },
        err => console.log(err)
      );
  }

  showAddNew() {
    this.drawer.create({
      nzTitle: 'Add New Category',
      nzWidth: 400,
      nzContent: CategoryFormComponent,
      nzMaskClosable: false
    });
  }

  showEdit(category: CategoryId) {
    this.drawer.create({
      nzTitle: 'Edit Category',
      nzWidth: 400,
      nzMaskClosable: false,
      nzContent: CategoryFormComponent,
      nzContentParams: {
        category
      }
    });
  }

}
