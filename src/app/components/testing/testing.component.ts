import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { ApiCallsService } from '../../services/api-calls.service';
import { dataBySearch } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { API } from '../../constants/allConstants';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css',
})
export class TestingComponent implements OnInit {
  chat = inject(ChatService);
  apiCalls = inject(ApiCallsService);
  dataBySearch: dataBySearch[] = [];

  ngOnInit(): void {}

  searchUser(event: any) {
    console.log(event.target.value);
    this.apiCalls.searchUser(event.target.value).subscribe((data: any) => {
      this.dataBySearch = data?.data;
      console.log(this.dataBySearch);
    });
  }

  findImage(profileImagePath: string | undefined) {
    return 'https://img.freepik.com/premium-vector/default-male-user-profile-icon-vector-illustration_276184-168.jpg';
  }
  // onClick() {
  //   console.log(this.chat.connection?.baseUrl);
  //   this.chat
  //     .addchat('deepkaran987@gmail.com')
  //     .then((data) => console.log(data))
  //     .catch((err) => console.log(err));
  // }

  // onClick2() {
  //   this.chat
  //     .sendMessage('deepkaran987@gmail.com', 'Hello', 1, '', '')
  //     .then((dat) => {
  //       console.log(dat, 'eeeeeeeeeeeeeeeeeeeeeeeeee');
  //     });
  // }

  // onClick3() {
  //   this.chat
  //     .previousMessages('95c5f7d9-152c-4ffd-be5a-02f0c817b764', 1)
  //     .then((data) => {
  //       console.log(data);
  //     });
  // }
}
