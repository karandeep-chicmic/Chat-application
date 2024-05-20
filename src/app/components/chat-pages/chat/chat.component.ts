import { Component, inject, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnChanges, OnInit, OnDestroy {
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
  private messagesSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.messagesSubscription = this.chat.messages$.subscribe((data) => {
      if (data) {
        this.chatMessages?.data?.push(data);
      }
    });

    // Initialize the previous messages when the component loads
    this.loadPreviousMessages();
  }

  ngOnChanges(): void {
    // Update the chat messages if chatData or selectedEmail changes
    this.loadPreviousMessages();
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }

  loadPreviousMessages(): void {
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
    console.log(this.chatMessages);

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
