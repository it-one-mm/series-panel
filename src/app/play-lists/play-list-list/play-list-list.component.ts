import { Component, OnInit } from "@angular/core";
import { NzDrawerService } from "ng-zorro-antd";
import {
  PlayListService,
  PlayListId
} from "src/app/services/play-list.service";
import { PlayListFormComponent } from "../play-list-form/play-list-form.component";

@Component({
  selector: "app-play-list-list",
  templateUrl: "./play-list-list.component.html",
  styleUrls: ["./play-list-list.component.less"]
})
export class PlayListListComponent implements OnInit {
  isSpinning = false;
  playLists: PlayListId[] = [];

  constructor(
    private drawer: NzDrawerService,
    private playListService: PlayListService
  ) {}

  ngOnInit() {
    this.isSpinning = true;
    this.playListService.getAll().subscribe(
      playLists => {
        this.playLists = playLists;
        this.isSpinning = false;
      },
      err => console.log(err)
    );
  }

  showAddNew() {
    this.drawer.create({
      nzTitle: "Add New PlayList",
      nzWidth: 400,
      nzContent: PlayListFormComponent,
      nzMaskClosable: false
    });
  }

  showEdit(playList: PlayListId) {
    this.drawer.create({
      nzTitle: "Edit PlayList",
      nzWidth: 400,
      nzMaskClosable: false,
      nzContent: PlayListFormComponent,
      nzContentParams: {
        playList
      }
    });
  }
}
