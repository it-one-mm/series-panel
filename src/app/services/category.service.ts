import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, shareReplay } from 'rxjs/operators';

export interface Category {
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CategoryId extends Category { id: string; }

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private categoriesCollection: AngularFirestoreCollection<Category>;

    constructor(
        afs: AngularFirestore) {
        this.categoriesCollection = afs.collection('categories');
    }

    getAll() {
        return this.categoriesCollection.snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Category;
                    const id = a.payload.doc.id;
                    return { id, ...data } as CategoryId;
                })),
                shareReplay()
            );
    }

    save(category: Category) {
        return this.categoriesCollection.add(category);
    }

    update(categoryId: string, category: Category) {
        return this.categoriesCollection.doc(categoryId).update(category);
    }

}