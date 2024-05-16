import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.css',
})
export class ChatHomeComponent {
  router = inject(Router);
  chat = inject(ChatService);

  isCollapsed: boolean = false;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  // sendMessage(){

  // }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    this.router.navigate(['/login']);
  }
}
