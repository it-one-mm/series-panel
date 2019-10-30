import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayListListComponent } from './play-list-list.component';

describe('PlayListListComponent', () => {
  let component: PlayListListComponent;
  let fixture: ComponentFixture<PlayListListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayListListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayListListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
