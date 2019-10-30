import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { shareReplay, map } from 'rxjs/operators';

export interface Movie {
    title: string;
    languageId: string;
    language: string;
    playListId: string;
    playListTitle: string;
    categoryId: string;
    categoryName: string;
    imageFileName?: string;
    videoFileName?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface MovieId extends Movie { id: string; }

@Injectable({
    providedIn: 'root'
})
export class MovieService {

    private moviesCollection: AngularFirestoreCollection<Movie>;

    constructor(afs: AngularFirestore) {
        this.moviesCollection = afs.collection('movies');
    }

    getAll() {
        return this.moviesCollection.snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Movie;
                    const id = a.payload.doc.id;
                    return { id, ...data } as MovieId;
                })),
                shareReplay()
            );
    }

    save(movie: Movie) {
        return this.moviesCollection.add(movie);
    }

    update(movieId: string, movie: Movie) {
        return this.moviesCollection.doc(movieId).update(movie);
    } 

    delete(movie: MovieId) {
        return this.moviesCollection.doc(movie.id).delete();
    }

}