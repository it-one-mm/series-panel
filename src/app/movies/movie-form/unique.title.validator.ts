import { AbstractControl, ValidationErrors, AsyncValidator } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';

@Injectable()
export class UniqueTitleValidator implements AsyncValidator {

    constructor(private afs: AngularFirestore) {}


    validate (
        ctrl: AbstractControl
        ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
            
        const title = (<string>ctrl.value);

        return this.afs.collection('movies', ref => ref.where('title', '==', title))
            .valueChanges()
            .pipe(
                take(1),
                map(arr => arr.length ? {duplicated: true} : null)
            );

    }
    
}