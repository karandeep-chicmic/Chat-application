import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
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
import { ApiCallsService } from '../../../services/api-calls.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit
{
  // All the injected services.
  chat: ChatService = inject(ChatService);
  formBuilder: FormBuilder = inject(FormBuilder);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  apiCalls: ApiCallsService = inject(ApiCallsService);

  @Input() chatData: any;
  @Input() selectedEmail: any;
  @ViewChild('chatHistory') chatHistoryContainer!: ElementRef;

  // All the chat messages associated with the selected user
  chatMessages: any;
  pageNumber: number = 0;
  fileToUpload: any;

  // Form for Sending msg
  form: FormGroup = this.formBuilder.group({
    inputChatMsg: [''],
    fileInput: [''],
  });

  previousMessages: any;
  messagesSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.messagesSubscription = this.chat.messages$.subscribe((data) => {
      const emailFromSession: string | null = sessionStorage.getItem('email');
      if (
        data &&
        (String(data?.receiverEmail) === this.selectedEmail ||
          String(data?.senderEmail) === this.selectedEmail)
      ) {
        this.chatMessages?.data?.push(data);
      }
      if (String(data?.receiverEmail) === String(emailFromSession)) {
        this.sweetAlert.success('message from :' + data.senderEmail);
      }
      this.scrollToBottom();
    });

    // Initialize the previous messages when the component loads
    this.loadPreviousMessages();
  }

  ngOnChanges(): void {
    // Update the chat messages if chatData or selectedEmail changes
    this.loadPreviousMessages();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    // Clean up the subscription
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
          this.scrollToBottom();
        })
        .catch((err) => console.log(err));
    }
  }

  sendMsg() {
    const msg = this.form.controls['inputChatMsg'].value;
    //  if file doesnt exists ie not uploaded
    if (!this.fileToUpload) {
      this.chat
        .sendMessage(this.selectedEmail, msg, 1, '', '')
        .then((data) => {
          this.scrollToBottom();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.fileToUpload) {
      // when file exists then save to db.
      const type: string = this.fileToUpload?.type;

      // Check type to send
      var typeToSend: number = -1;
      if (type.includes('image')) {
        typeToSend = 2;
      } else {
        typeToSend = 3;
      }

      const data = new FormData();
      data.append('file', this.fileToUpload);

      const email = sessionStorage.getItem('email') ?? '';

      this.apiCalls.saveFileToDb(typeToSend, email, data).subscribe({
        next: (data: any) => {
          console.log(data.data);
          this.chat
            .sendMessage(
              this.selectedEmail,
              msg,
              typeToSend,
              data.data.filePath,
              data.data.fileName
            )
            .then(() => {
              console.log('Saved msg as well as file to db!');
            });
        },
        error: (err) => {
          console.log(err);
        },
      });

      console.log('contains file ');
      this.fileToUpload = '';
    }

    this.form.reset();
  }

  scrollToBottom() {
    // debugger
    if (this.chatHistoryContainer?.nativeElement) {
      try {
        this.chatHistoryContainer.nativeElement.scrollTop =
          this.chatHistoryContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Could not scroll to the bottom of chat:', err);
      }
    }
  }

  loadMoreMsgs() {
    if (this.chatHistoryContainer.nativeElement.scrollTop === 0) {
      this.pageNumber = this.chatMessages.data.length;

      this.chat
        .previousMessages(this.chatData, this.pageNumber)
        .then((data) => {
          console.log(data.data);
          if (data.data.length === 0) {
            this.sweetAlert.success('No More messages!!');
          }

          // add to the starting of chat messages the msgs from backend
          data.data.forEach((msgs: any) => {
            this.chatMessages.data.unshift(msgs);
          });
        });
    }
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMsg();
      // this.scrollToBottom();
    }
  }

  fileUpload(event: any) {
    this.fileToUpload = event.target.files[0];
    console.log(this.fileToUpload);
  }
}
