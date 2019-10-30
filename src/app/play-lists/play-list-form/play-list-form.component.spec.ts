import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayListFormComponent } from './play-list-form.component';

describe('PlayListFormComponent', () => {
  let component: PlayListFormComponent;
  let fixture: ComponentFixture<PlayListFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayListFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
