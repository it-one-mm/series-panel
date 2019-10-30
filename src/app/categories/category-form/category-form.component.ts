import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { CategoryService, CategoryId } from 'src/app/services/category.service';
import { Category } from '../../services/category.service';
import { Observer, Observable } from 'rxjs';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.less']
})
export class CategoryFormComponent implements OnInit {

  isSpinning = false;
  form: FormGroup;

  private oldValue = '';
  private categories: CategoryId[] = [];

  @Input('category') category: CategoryId;

  constructor(
    private fb: FormBuilder,
    private drawerRef: NzDrawerRef,
    private message: NzMessageService,
    private categoryService: CategoryService) { }

  ngOnInit() {
    this.form = this.fb.group({
      'name': ['', [Validators.required], [this.categoryNameAsyncValidator]]
    });

    this.categoryService.getAll()
      .subscribe(
        categories => this.categories = categories
      );

    if (this.category) {
      this.oldValue = this.category.name;

      this.form.patchValue({
        'name': this.category.name
      });
    }
  }

  save(value: any) {
    if (this.form.invalid) return;

    this.isSpinning = true;

    const category: Category = {
      name: (value.name as string).trim(),
      createdAt: new Date
    }

    if (!this.category) {
    
      this.categoryService.save(category)
        .then(
          () => {
            this.message.success('Category saved Successfully!');
            this.isSpinning = false;
            this.form.reset();
          }
        )
        .catch(err => {
          this.message.error('Error occured!');
          console.log(err);
        });
    } else {
      delete category.createdAt;
      category.updatedAt = new Date()
      this.categoryService.update(this.category.id, category)
        .then(
          () => {
            this.message.success('Category updated Successfully!');
            this.isSpinning = false;
            this.close();
          }
        )
        .catch(
          err => {
            this.message.error('Error occured!');
            console.log(err);
          }
        );
    }
  }

  private categoryNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        const newName = (<string>control.value).toLowerCase().trim();

        const categories = [...this.categories];
        if (this.oldValue.toLowerCase() === newName) {
          observer.next(null);
        } else {
          const category = categories.find(m => m.name.toLowerCase() === newName);
          if (category) {
            // you have to return `{error: true}` to mark it as an error event
            observer.next({ error: true, duplicated: true });  
          } else {
            observer.next(null);
          }
        }
        observer.complete();

      }, 500);
    });

  close() {
    this.drawerRef.close();
  }

}
