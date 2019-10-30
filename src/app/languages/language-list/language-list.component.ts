import { Component, OnInit } from '@angular/core';
import { LanguageFormComponent } from '../language-form/language-form.component';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { LanguageId, LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.less']
})
export class LanguageListComponent implements OnInit {

  isSpinning = false;
  languages: LanguageId[] = [];

  constructor(
    private drawer: NzDrawerService,
    private languageService: LanguageService,
    private message: NzMessageService) { }

  ngOnInit() {
    this.isSpinning = true;
    this.languageService.getAll()
      .subscribe(
        languages => { 
          this.languages = languages;
          this.isSpinning = false;
        },
        err => console.log(err)
      );
  }

  showAddNew() {
    this.drawer.create({
      nzTitle: 'Add New Language',
      nzWidth: 400,
      nzContent: LanguageFormComponent,
      nzMaskClosable: false
    });
  }

  showEdit(language: LanguageId) {
    this.drawer.create({
      nzTitle: 'Edit Language',
      nzWidth: 400,
      nzMaskClosable: false,
      nzContent: LanguageFormComponent,
      nzContentParams: {
        language
      }
    });
  }

}
