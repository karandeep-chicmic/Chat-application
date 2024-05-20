import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { user } from '../../../interfaces/user.interface';
import { ApiCallsService } from '../../../services/api-calls.service';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { STATUS_CODES } from '../../../constants/allConstants';
import { UsedDataService } from '../../../services/used-data.service';
import { ChatService } from '../../../services/chat.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // All the Injected Services
  http: HttpClient = inject(HttpClient);
  formBuilder: FormBuilder = inject(FormBuilder);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  router: Router = inject(Router);
  usedData: UsedDataService = inject(UsedDataService);
  chat: ChatService = inject(ChatService);

  // all Variables and forms
  form: FormGroup = this.formBuilder.group({
    email: [
      'karandeep.singh@chicmic.co.in',
      [Validators.required, Validators.email],
    ],
    password: ['Noahrem@12', [Validators.required, Validators.minLength(8)]],
  });

  // Class methods
  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Form is Invalid');
      console.log(this.form.controls['password'] );
      
      return;
    }
    const userInForm: user = {
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    };

    this.apiCalls.loginUser(userInForm).subscribe((data) => {
      if (data.statusCode != STATUS_CODES.SUCCESS) {
        this.sweetAlert.error(data.message);
      } else {
        this.usedData.token.set(true); //to display the navbar on basis of token availabilty
        this.usedData.username.set(data.data.name); //to set the name of the user so it ll be displayed in navbar
        this.sweetAlert.success(data.message);
        sessionStorage.setItem('name', data.data.name);
        sessionStorage.setItem('userId', data.data.userID);
        sessionStorage.setItem('token', data.data.token);

        // Starting the Signal R connection
        this.chat.startConnection();

        // Refresh Event Called again
        this.chat.connection?.on('refresh', () => {
          console.log('it is in refresh');
        });

        // Receive message event called again
        this.chat.connection?.on('receiveMessage', (data) => {
          console.log('Message Received', data);
          this.chat.messageSubject.next(data);
        });
        this.router.navigate(['/chatHome']); //navigate to chatHome
      }
    });
  }
}
