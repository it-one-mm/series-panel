import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { NzDrawerRef, NzMessageService } from 'ng-zorro-antd';
import { LanguageService, Language, LanguageId } from 'src/app/services/language.service';
import { Observable } from 'rxjs';
import { Observer } from 'firebase';

@Component({
  selector: 'app-language-form',
  templateUrl: './language-form.component.html',
  styleUrls: ['./language-form.component.less']
})
export class LanguageFormComponent implements OnInit {

  isSpinning = false;
  form: FormGroup;

  private oldValue = '';
  private languages: LanguageId[] = [];

  @Input('language') language: LanguageId;

  constructor(
    private fb: FormBuilder,
    private drawerRef: NzDrawerRef,
    private message: NzMessageService,
    private languagaeService: LanguageService) { }

  ngOnInit() {
    this.form = this.fb.group({
      'language': ['', [Validators.required], [this.languageAsyncValidator]]
    });

    this.languagaeService.getAll()
      .subscribe(
        languages => this.languages = languages
      );

    if (this.language) {
      this.oldValue = this.language.language;
      this.form.patchValue({
        'language': this.language.language
      });
    }
  }

  save(value: any) {
    if (this.form.invalid) return;

    this.isSpinning = true;

    const language: Language = {
      language: (value.language as string).trim(),
      createdAt: new Date
    }

    if (!this.language) {
      this.languagaeService.save(language)
      .then(
        () => {
          this.message.success('Language saved Successfully!');
          this.isSpinning = false;
          this.form.reset();
        }
      )
      .catch(err => {
        this.message.error('Error occured!');
        console.log(err);
      });
    } else {
      delete language.createdAt;
      language.updatedAt = new Date();
      this.languagaeService.update(this.language.id, language)
        .then(
          () => {
            this.message.success('Language updated Successfully!');
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

  private languageAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        const newLanguage = (<string>control.value).toLowerCase().trim();

        const languages = [...this.languages];
        if (this.oldValue.toLowerCase() === newLanguage) {
          observer.next(null);
        } else {
          const language = languages.find(m => m.language.toLowerCase() === newLanguage);
          if (language) {
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
