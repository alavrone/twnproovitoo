import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  isMenuVisible: boolean = false;

  toggleMenu(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth > 768) {
      this.isMenuVisible = false;
    }
  }
}
