import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { ApiCallsService } from '../../../services/api-calls.service';
import { dataBySearch } from '../../../interfaces/user.interface';
import { API, DEFAULT_USER_IMG } from '../../../constants/allConstants';
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
  // All the injected Services
  router = inject(Router);
  chat = inject(ChatService);
  apiCalls = inject(ApiCallsService);

  dataBySearch: dataBySearch[] = [];
  chatData: any;
  selectedEmail: string = '';
  alreadyChatWithUser: any;
  username: string | null = 'temp';
  altImgURl: string = '';

  ngOnInit(): void {
    this.waitForConnection().then(() => {
      this.chat
        .getUsers()
        .then((data) => {
          this.dataBySearch = data.data;
          console.log(data.data);
        })
        .catch((err) => {
          console.log('Error is :', err);
        });
    });
    this.altImgURl = DEFAULT_USER_IMG.IMAGE;
    // this.dataBySearch = this.alreadyChatWithUser

    this.username = sessionStorage.getItem('name');
  }

  waitForConnection(): Promise<void> {
    //to wait for the connection
    return new Promise((resolve, reject) => {
      const checkConnection = () => {
        if (this.chat.connection?.state.toLowerCase() === 'connected') {
          resolve();
        } else if (
          this.chat.connection?.state.toLowerCase() === 'disconnected' ||
          this.chat.connection?.state.toLowerCase() === 'failed'
        ) {
          reject('Connection failed');
        } else {
          setTimeout(checkConnection, 100); // check every 100 ms
        }
      };
      checkConnection();
    });
  }

  searchUser(event: any) {
    this.apiCalls.searchUser(event.target.value).subscribe((data: any) => {
      this.dataBySearch = data?.data;
    });
  }

  findImage(profileImagePath: string | undefined) {
    if (profileImagePath || profileImagePath !== '') {
      console.log(profileImagePath);

      return API.BASE_URL + '/' + profileImagePath;
    }
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

  onImageError() {
    return this.altImgURl;
  }
}
