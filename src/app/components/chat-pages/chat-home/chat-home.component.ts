import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { ApiCallsService } from '../../../services/api-calls.service';
import { dataBySearch, user } from '../../../interfaces/user.interface';
import { API, DEFAULT_USER_IMG } from '../../../constants/allConstants';
import { CommonModule } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { UsedDataService } from '../../../services/used-data.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  usedData = inject(UsedDataService);

  // All variables
  dataBySearch: dataBySearch[] = [];
  defaultData: dataBySearch[] = [];
  chatData: any;
  selectedEmail: string = '';
  alreadyChatWithUser: any;
  username: string | null = 'temp';
  altImgURl: string = '';
  private searchSubject = new Subject<string>();

  // Constructor and Lifecycle hooks
  ngOnInit(): void {
    this.setUsers(false);
    this.chat.messages$.subscribe(() => {
      this.setUsers(true);
    });

    // for debouncing
    this.searchSubject
      .pipe(
        debounceTime(300), // 300ms debounce time
        distinctUntilChanged() // Only emit when the value changes
      )
      .subscribe((searchText) => {
        this.apiCalls.searchUser(searchText).subscribe((data: any) => {
          this.dataBySearch = data?.data;
        });
      });
  }

  setUsers(flag: boolean): void {
    // Wait for connection to be connected
    this.waitForConnection().then(() => {
      //To get the chat History
      this.chat
        .getUsers()
        .then((data) => {
          if (data.data) {
            // Common data for search and Chat history users.
            this.dataBySearch = data.data;
            this.defaultData = data.data;

            
            // Setting the last talked user to default
            if (!flag) {
              this.chatData = data.data[0]?.chatRoomId;
              this.selectedEmail = data.data[0]?.email;
            }
          }
        })
        .catch((err) => {
          // Error Handling
          console.log('Error is :', err);
        });
    });

    // Alternate Image
    this.altImgURl = DEFAULT_USER_IMG.IMAGE;
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
          reject(new Error('Connection failed'));
        } else {
          setTimeout(checkConnection, 100); // check every 100 ms
        }
      };
      checkConnection();
    });
  }

  // search the user on basis of user input
  searchUser(event: any) {
    const searchText = event.target.value;
    if (searchText === '') {
      this.setToDefault();
      return;
    }
    this.searchSubject.next(searchText);
  }

  // To find the Image of particular user
  findImage(profileImagePath: string | undefined, err?: string) {
    if (err) {
      return DEFAULT_USER_IMG.IMAGE;
    }
    if (profileImagePath && profileImagePath !== '') {
      return API.BASE_URL + '/' + profileImagePath;
    }
    return DEFAULT_USER_IMG.IMAGE;
  }

  // Get Chat of user on Click
  getChat(email: string | undefined) {
    this.selectedEmail = email ?? '';
    this.chat
      .addChat(email ?? '')
      .then((data) => {
        this.chatData = data;
      })
      .catch((err) => console.log('Error is: ' + err));
  }

  // Image error
  onImageError() {
    return this.altImgURl;
  }

  setToDefault() {
    this.dataBySearch = this.defaultData;
  }
}
