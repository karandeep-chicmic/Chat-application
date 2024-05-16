import { Component, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    
  ],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css',
})
export class TestingComponent {
  chat = inject(ChatService);

  onClick() {
    console.log(this.chat.connection?.baseUrl);
    this.chat
      .addchat('deepkaran987@gmail.com')
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  onClick2() {
    this.chat
      .sendMessage('deepkaran987@gmail.com', 'Hello', 1, '', '')
      .then((dat) => {
        console.log(dat, 'eeeeeeeeeeeeeeeeeeeeeeeeee');
      });
  }

  onClick3() {
    this.chat
      .previousMessages('95c5f7d9-152c-4ffd-be5a-02f0c817b764', 1)
      .then((data) => {
        console.log(data);
      });
  }
}
