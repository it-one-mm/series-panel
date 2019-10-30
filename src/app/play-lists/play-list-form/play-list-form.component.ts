import { Component, OnInit, Input } from "@angular/core";
import {
  PlayList,
  PlayListService,
  PlayListId
} from "src/app/services/play-list.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidationErrors
} from "@angular/forms";
import { CategoryService, CategoryId } from "src/app/services/category.service";
import { NzMessageService, NzDrawerRef } from "ng-zorro-antd";
import { map } from "rxjs/operators";
import { Observable, Observer } from "rxjs";

@Component({
  selector: "app-play-list-form",
  templateUrl: "./play-list-form.component.html",
  styleUrls: ["./play-list-form.component.less"]
})
export class PlayListFormComponent implements OnInit {
  isSpinning = false;
  isLoading = false;
  form: FormGroup;
  listOfCategories: Array<{ label: string; value: CategoryId }> = [];

  private oldValue = "";
  private playLists: PlayListId[] = [];

  @Input("playList") playList: PlayListId;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private playListService: PlayListService,
    private message: NzMessageService,
    private drawerRef: NzDrawerRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      selectedCategory: [null, [Validators.required]],
      title: ["", [Validators.required], [this.playListTitleAsyncValidator]],
      imageFileName: [""],
      author: ["", Validators.required],
      description: ["", Validators.required]
    });

    this.isLoading = true;
    this.categoryService
      .getAll()
      .pipe(
        map(categories =>
          categories.map(category => {
            return {
              label: category.name,
              value: {
                id: category.id,
                name: category.name
              }
            };
          })
        )
      )
      .subscribe(
        categories => {
          this.listOfCategories = categories;
          this.isLoading = false;

          if (this.playList) {
            const categories = [...this.listOfCategories];
            const categoryIndex = categories.findIndex(
              category => category.label === this.playList.categoryName
            );
            this.form.patchValue({
              selectedCategory: categories[categoryIndex].value
            });
          }
        },
        err => console.log(err)
      );

    this.playListService
      .getAll()
      .subscribe(playLists => (this.playLists = playLists));

    if (this.playList) {
      this.oldValue = this.playList.title;
      this.form.patchValue({
        title: this.playList.title,
        imageFileName: this.playList["imageFileName"]
          ? this.playList.imageFileName
          : "",
        author: this.playList.author,
        description: this.playList.description
      });
    }
  }

  save(value) {
    if (this.form.invalid) return;

    this.isSpinning = true;

    const selectedCategory = value.selectedCategory;

    const playList: PlayList = {
      title: value.title.trim(),
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      author: value.author.trim(),
      description: value.description.trim(),
      createdAt: new Date()
    };

    if (value["imageFileName"]) playList.imageFileName = value["imageFileName"];

    if (!this.playList) {
      this.playListService
        .save(playList)
        .then(() => {
          this.isSpinning = false;
          this.message.success(`PlayList saved successfully!`);
          this.form.reset();
        })
        .catch(err => {
          this.message.error("Error occured!");
          console.log(err);
        });
    } else {
      delete playList.createdAt;
      playList.updatedAt = new Date();
      this.playListService
        .update(this.playList.id, playList)
        .then(() => {
          this.message.success(`PlayList updated successfully!`);
          this.isSpinning = false;
          this.close();
        })
        .catch(err => {
          this.message.error("Error occured!");
          console.log(err);
        });
    }
  }

  private playListTitleAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        const newPlayList = (<string>control.value).toLowerCase().trim();

        const playLists = [...this.playLists];
        if (this.oldValue.toLowerCase() === newPlayList) {
          observer.next(null);
        } else {
          const playList = playLists.find(
            m => m.title.toLowerCase() === newPlayList
          );
          if (playList) {
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
