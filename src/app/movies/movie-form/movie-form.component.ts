import { Component, OnInit, Input } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors
} from "@angular/forms";
import {
  PlayListId,
  PlayListService
} from "src/app/services/play-list.service";
import { LanguageService, LanguageId } from "src/app/services/language.service";
import { MovieService, Movie, MovieId } from "src/app/services/movie.service";
import { map } from "rxjs/operators";
import { NzMessageService, NzDrawerRef } from "ng-zorro-antd";
import { Observer, Observable } from "rxjs";

@Component({
  selector: "app-movie-form",
  templateUrl: "./movie-form.component.html",
  styleUrls: ["./movie-form.component.less"]
})
export class MovieFormComponent implements OnInit {
  isSpinning = false;
  languageLoading = false;
  playListLoading = false;
  private oldTitle = "";
  private movies: MovieId[] = [];

  form: FormGroup;
  listOfPlayLists: Array<{ label: string; value: PlayListId }> = [];
  listOfLanguages: Array<{ label: string; value: LanguageId }> = [];

  @Input("movie") movie: MovieId;

  constructor(
    private fb: FormBuilder,
    private playListService: PlayListService,
    private languageService: LanguageService,
    private movieService: MovieService,
    private message: NzMessageService,
    private drawerRef: NzDrawerRef
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      selectedLanguage: [null, [Validators.required]],
      selectedPlayList: [null, [Validators.required]],
      title: [
        "",
        {
          validators: [Validators.required],
          asyncValidators: [this.movieTitleAsyncValidator]
        }
      ],
      imageFileName: [""],
      videoFileName: [""]
    });

    this.movieService.getAll().subscribe(
      movies => {
        this.movies = movies;
      },
      err => console.log(err)
    );

    this.playListLoading = true;
    this.languageLoading = true;

    this.playListService
      .getAll()
      .pipe(
        map(playLists =>
          playLists.map(playList => {
            return {
              label: playList.title,
              value: {
                id: playList.id,
                title: playList.title,
                author: playList.author,
                description: playList.description,
                categoryId: playList.categoryId,
                categoryName: playList.categoryName
              }
            };
          })
        )
      )
      .subscribe(playLists => {
        this.listOfPlayLists = playLists;
        this.playListLoading = false;
        if (this.movie) {
          const playLists = [...this.listOfPlayLists];
          const playListIndex = playLists.findIndex(
            playList => playList.label === this.movie.playListTitle
          );
          const selectedPlayList = playLists[playListIndex].value;
          this.form.patchValue({
            selectedPlayList: selectedPlayList
          });
        }
      });

    this.languageService
      .getAll()
      .pipe(
        map(languages =>
          languages.map(language => {
            return {
              label: language.language,
              value: {
                id: language.id,
                language: language.language
              }
            };
          })
        )
      )
      .subscribe(languages => {
        this.listOfLanguages = languages;
        this.languageLoading = false;
        if (this.movie) {
          const languages = [...this.listOfLanguages];
          const languageIndex = languages.findIndex(
            language => language.label === this.movie.language
          );
          const selectedLanguage = languages[languageIndex].value;
          this.form.patchValue({
            selectedLanguage: selectedLanguage
          });
        }
      });

    if (this.movie) {
      this.oldTitle = this.movie.title;

      this.form.patchValue({
        title: this.movie.title,
        imageFileName: this.movie["imageFileName"]
          ? this.movie["imageFileName"]
          : "",
        videoFileName: this.movie["videoFileName"]
          ? this.movie["videoFileName"]
          : ""
      });
    }
  }

  private movieTitleAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        const newTitle = (<string>control.value).toLowerCase().trim();

        const movies = [...this.movies];
        if (this.oldTitle.toLowerCase() === newTitle) {
          observer.next(null);
        } else {
          const movie = movies.find(m => m.title.toLowerCase() === newTitle);
          if (movie) {
            // you have to return `{error: true}` to mark it as an error event
            observer.next({ error: true, duplicated: true });
          } else {
            observer.next(null);
          }
        }
        observer.complete();
      }, 500);
    });

  save(value) {
    if (this.form.invalid) return;

    this.isSpinning = true;

    const movie: Movie = {
      title: (<string>value.title).trim(),
      categoryId: value.selectedPlayList.categoryId,
      categoryName: (<string>value.selectedPlayList.categoryName).trim(),
      playListId: value.selectedPlayList.id,
      playListTitle: (<string>value.selectedPlayList.title).trim(),
      languageId: value.selectedLanguage.id,
      language: (<string>value.selectedLanguage.language).trim(),
      createdAt: new Date()
    };

    if (value["imageFileName"]) movie.imageFileName = value.imageFileName;
    if (value["videoFileName"]) movie.videoFileName = value.videoFileName;

    if (!this.movie) {
      this.movieService
        .save(movie)
        .then(() => {
          this.form.reset();
          this.message.success("Movie saved successfully!");
          this.isSpinning = false;
        })
        .catch(err => {
          this.message.error("Error occured!");
          console.log(err);
        });
    } else {
      delete movie.createdAt;
      movie.updatedAt = new Date();
      this.movieService
        .update(this.movie.id, movie)
        .then(() => {
          this.message.success(`Movie '${movie.title}' update successfully!`);
          this.isSpinning = false;
          this.close();
        })
        .catch(err => {
          this.message.error("Error occured!");
          console.log(err);
        });
    }
  }

  close() {
    this.drawerRef.close();
  }
}
