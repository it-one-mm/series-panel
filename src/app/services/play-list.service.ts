import { Injectable } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { shareReplay, map } from "rxjs/operators";

export interface PlayList {
  title: string;
  categoryId: string;
  categoryName: string;
  imageFileName?: string;
  author: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlayListId extends PlayList {
  id: string;
}

@Injectable({
  providedIn: "root"
})
export class PlayListService {
  private playListsCollection: AngularFirestoreCollection<PlayList>;

  constructor(afs: AngularFirestore) {
    this.playListsCollection = afs.collection<PlayList>("play-lists");
  }

  getAll() {
    return this.playListsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data() as PlayList;
          const id = a.payload.doc.id;
          return { id, ...data } as PlayListId;
        })
      ),
      shareReplay()
    );
  }

  save(playList: PlayList) {
    return this.playListsCollection.add(playList);
  }

  update(playListId: string, playList: PlayList) {
    return this.playListsCollection.doc(playListId).update(playList);
  }
}
