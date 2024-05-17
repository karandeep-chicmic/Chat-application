import { Component, inject, Input, OnChanges } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnChanges {
  chat: ChatService = inject(ChatService);
  formBuilder: FormBuilder = inject(FormBuilder);

  @Input() chatData: any;
  @Input() selectedEmail: any;

  // All the chat messages associated with the selected user
  chatMessages: any;
  pageNumber: number = 1;

  // Form for Sending msg
  form: FormGroup = this.formBuilder.group({
    inputChatMsg: ['', [Validators.required]],
  });

  previousMessages: any; 

  ngOnChanges(): void {
    if (this.chat.connection?.state !== 'Connecting') {
      this.chat
        .previousMessages(this.chatData, this.pageNumber)
        .then((data) => {
          this.chatMessages = data;
          // console.log(this.chatMessages);
          
        })
        .catch((err) => console.log(err));
    }
  }

  sendMsg() {
    console.log(this.selectedEmail);
    // this.previousMessages =  

    const msg = this.form.controls['inputChatMsg'].value;
    this.chat
      .sendMessage(this.selectedEmail, msg, 1, '', '')
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    this.form.reset();
  }
}
