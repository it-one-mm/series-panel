import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  title: string = '';
  isCollapsed = false;

  constructor(
    private router: Router) {}

  ngOnInit() {
    
    this.router.events
      .pipe( 
        filter(event => event instanceof ActivationEnd && event.snapshot.children.length == 0) 
      )
      .subscribe(
        (event: ActivationEnd) => this.title = event.snapshot.data.title
      ); 
  }
}
