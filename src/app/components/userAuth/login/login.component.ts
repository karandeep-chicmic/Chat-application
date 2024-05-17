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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  http = inject(HttpClient);
  formBuilder = inject(FormBuilder);
  apiCalls = inject(ApiCallsService);
  sweetAlert = inject(SweetAlertService);
  router = inject(Router);

  form: FormGroup = this.formBuilder.group({
    email: [
      'karandeep.singh@chicmic.co.in',
      [Validators.required, Validators.email],
    ],
    password: ['Noahrem@12', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Form is Invalid');
      return;
    }
    const userInForm: user = {
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
    };

    this.apiCalls.loginUser(userInForm).subscribe((data) => {
      console.log(data);
      if (data.statusCode != STATUS_CODES.SUCCESS) {
        this.sweetAlert.error(data.message);
      } else {
        this.sweetAlert.success(data.message);
        sessionStorage.setItem('name', data.data.name);
        sessionStorage.setItem('userId', data.data.userID);
        sessionStorage.setItem('token', data.data.token);
        this.router.navigate(['/chatHome']);
      }
    });
  }
}
