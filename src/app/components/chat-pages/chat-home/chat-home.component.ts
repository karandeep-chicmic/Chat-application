import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { ApiCallsService } from '../../../services/api-calls.service';
import { dataBySearch } from '../../../interfaces/user.interface';
import { DEFAULT_USER_IMG } from '../../../constants/allConstants';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-chat-home',
  standalone: true,
  imports: [RouterModule, CommonModule, ChatComponent],
  templateUrl: './chat-home.component.html',
  styleUrl: './chat-home.component.css',
})
export class ChatHomeComponent implements OnInit {
  router = inject(Router);
  // chat = inject(ChatService);
  apiCalls = inject(ApiCallsService);

  dataBySearch: dataBySearch[] = [];
  chatData: any;
  selectedEmail: string = '';
  alreadyChatWithUser: any;
  constructor(private chat: ChatService) {}

  ngOnInit(): void {
    // if (this.chat.connection?.state.toLowerCase() !== 'connecting') {
    // this.chat
    //   .getUsers()
    //   .then((data) => {
    //     this.dataBySearch = data;
    //     console.log(data);
    //   })
    //   .catch((err) => {
    //     console.log('Error is :', err);
    //   });
    // }
    // this.dataBySearch = this.alreadyChatWithUser
  }

  searchUser(event: any) {
    this.apiCalls.searchUser(event.target.value).subscribe((data: any) => {
      this.dataBySearch = data?.data;
    });
  }

  findImage(profileImagePath: string | undefined) {
    return DEFAULT_USER_IMG.IMAGE;
  }

  getChat(email: string | undefined) {
    this.selectedEmail = email || '';
    this.chat
      .addChat(email ?? '')
      .then((data) => {
        this.chatData = data;
      })
      .catch((err) => console.log('Error is: ' + err));
  }

  logout() {
    this.apiCalls.logoutUser().subscribe((data) => {
      console.log(data);
    });
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('name');
    this.router.navigate(['/login']);
  }
}
