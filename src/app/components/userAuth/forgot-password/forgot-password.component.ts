import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forgotPass, user } from '../../../interfaces/user.interface';
import { environment } from '../../../../environments/environment';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ApiCallsService } from '../../../services/api-calls.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  // All the injected services
  formBuilder = inject(FormBuilder);
  sweetAlert = inject(SweetAlertService);
  activatedRoute = inject(ActivatedRoute);
  apiCalls = inject(ApiCallsService);
  router = inject(Router);

  // Lifecycle hooks and constructor
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['token']) {
        this.token = params['token'];
      }
    });
  }

  // All variables

  // Form for sending email and receiving url in response inside Email
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    urldirect: [''],
  });

  // Form for password match (new Password)
  formPass: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordMatch: ['', [Validators.required, Validators.minLength(6)]],
  });
  token: string = ''; // if token then show formPass else show form

  // Methods of class

  onSubmit() {
    // on submit of form

    if (this.form.invalid) {
      this.sweetAlert.error('Form is Invalid');
      return;
    }
    const forgotPassObject: forgotPass = {
      email: this.form.controls['email'].value,
      urldirect: environment.BASE_URL_FRONTEND + location.pathname,
    };

    this.apiCalls.forgotPass(forgotPassObject).subscribe({
      next: (res) => {
        this.sweetAlert.successModalMsg('Check Email for Change of Password!');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  onSubmitPass() {
    if (this.formPass.invalid) {
      this.sweetAlert.error('Form is Invalid');
      return;
    }
    // on submit of formPass
    if (
      this.formPass.controls['password'].value !==
      this.formPass.controls['passwordMatch'].value
    ) {
      this.sweetAlert.error('Password does not match');
      return;
    }

    const password: user = {
      password: this.formPass.controls['password'].value,
    };

    this.apiCalls.changePassword(password, this.token).subscribe({
      next: (res) => {
        console.log(res);
        this.sweetAlert.success('Successfully saved new password');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('Error is : ', err);
      },
    });
  }
}
