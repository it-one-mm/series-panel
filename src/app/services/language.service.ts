import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, shareReplay } from 'rxjs/operators';

export interface Language {
    language: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LanguageId extends Language { id: string; }

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    private languagesCollection: AngularFirestoreCollection<Language>;

    constructor(
        afs: AngularFirestore) {
        this.languagesCollection = afs.collection('languages');
    }

    getAll() {
        return this.languagesCollection.snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Language;
                    const id = a.payload.doc.id;
                    return { id, ...data } as LanguageId;
                })),
                shareReplay()
            );
    }

    save(language: Language) {
        return this.languagesCollection.add(language);
    }

    update(languageId: string, language: Language) {
        return this.languagesCollection.doc(languageId).update(language);
    }

}