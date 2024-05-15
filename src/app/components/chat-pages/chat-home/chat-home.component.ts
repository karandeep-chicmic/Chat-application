import { Component } from '@angular/core';


@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.css',
})
export class ChatHomeComponent {
  isCollapsed: boolean = false;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
