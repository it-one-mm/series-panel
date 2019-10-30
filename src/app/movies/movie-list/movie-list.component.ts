import { Component, OnInit } from '@angular/core';
import { NzDrawerService, NzMessageService } from 'ng-zorro-antd';
import { MovieFormComponent } from '../movie-form/movie-form.component';
import { MovieId, MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.less']
})
export class MovieListComponent implements OnInit {

  isSpinning = false;
  movies: MovieId[] = [];
  filterMovies: MovieId[] = [];

  constructor(
    private drawer: NzDrawerService,
    private message: NzMessageService,
    private movieService: MovieService,
  ) { }

  ngOnInit() {
    this.isSpinning = true;
    this.movieService.getAll()
      .subscribe(
        movies => { 
          this.movies = movies;
          this.filterMovies = [...movies];
          this.isSpinning = false;
        },
        err => console.log(err)
      );
  }

  showAddNew() {
    this.drawer.create({
      nzTitle: 'Add New Movie',
      nzWidth: 400,
      nzMaskClosable: false,
      nzContent: MovieFormComponent,
    });
  }

  showEdit(movie: MovieId) {
    this.drawer.create({
      nzTitle: 'Edit Movie',
      nzWidth: 400,
      nzMaskClosable: false,
      nzContent: MovieFormComponent,
      nzContentParams: {
        movie
      }
    });
  }

  delete(movie: MovieId) {
    this.isSpinning = true;

    this.movieService.delete(movie)
      .then(
        () => {
          this.message.success(`Movie '${movie.title}' deleted successfully.'`);
          this.isSpinning = false;
        }
      )
      .catch(
        err => {
          this.message.error('Error occured!');
          console.log(err);
        }
      );
  }

  search(value: string) {
    const search = value.trim();
    const movies = [...this.movies];
    this.filterMovies = search ? movies.filter(movie => movie.title.toLowerCase().indexOf(search.toLowerCase()) != -1) : movies;
  }

}
