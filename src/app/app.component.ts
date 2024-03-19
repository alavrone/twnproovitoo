import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MenuComponent,
  ],
})
export class AppComponent {
  constructor(private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  title = 'proovitoo';
}
