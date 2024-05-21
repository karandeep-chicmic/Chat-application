import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewChecked
{
  // All the injected services.
  chat: ChatService = inject(ChatService);
  formBuilder: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  @Input() chatData: any;
  @Input() selectedEmail: any;
  @ViewChild('chatHistory') chatHistoryContainer!: ElementRef;

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
      const emailFromSession: string | null = sessionStorage.getItem('email');
      if (
        data &&
        (data.receiverEmail === this.selectedEmail ||
          data.senderEmail === this.selectedEmail)
      ) {
        this.chatMessages?.data?.push(data);

        this.scrollToBottom();
      }
      if (data.receiverEmail === emailFromSession) {
        this.sweetAlert.success('message from :' + data.senderEmail);
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
    // Clean up the subscription
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
  ngAfterViewChecked() {
    // For scrolling to the bottom after the view changes basically when
    // the new message is added

    this.scrollToBottom();
  }

  loadPreviousMessages(): void {
    // debugger
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

  //  To send a message in chat
  sendMsg() {
    // console.log(this.chatMessages);

    const msg = this.form.controls['inputChatMsg'].value;
    this.chat
      .sendMessage(this.selectedEmail, msg, 1, '', '')
      .then((data) => {})
      .catch((err) => {
        console.log(err);
      });

    this.form.reset();
  }

  scrollToBottom() {
    try {
      this.chatHistoryContainer.nativeElement.scrollTop =
        this.chatHistoryContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Could not scroll to the bottom of chat:', err);
    }
  }
}
