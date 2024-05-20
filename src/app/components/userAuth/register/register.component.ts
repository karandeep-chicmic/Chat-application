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
import { STATUS_CODES } from '../../../constants/allConstants';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  http = inject(HttpClient);
  formBuilder = inject(FormBuilder);
  apiCalls = inject(ApiCallsService);
  sweetAlert = inject(SweetAlertService);
  router = inject(Router);

  regexPhoneNo = '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$';
  form: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    phoneNo: ['', [Validators.required, Validators.pattern(this.regexPhoneNo)]],
    dateOfBirth: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.sweetAlert.error('Form is Invalid');
      return;
    }

    const userInForm: user = {
      firstName: this.form.controls?.['firstName'].value,
      lastName: this.form.controls?.['lastName'].value,
      email: this.form.controls?.['email'].value,
      password: this.form.controls?.['password'].value,
      phoneNo: this.form.controls?.['phoneNo'].value,
      dateOfBirth: this.form.controls?.['dateOfBirth'].value,
    };

    this.apiCalls.registerUser(userInForm).subscribe({
      next: (res) => {
        console.log(res);

        if (res.statusCode !== STATUS_CODES.SUCCESS) {
          this.sweetAlert.error(res.message);
        } else {
          this.sweetAlert.success(res.message);
          sessionStorage.setItem('name', res.data.name);
          sessionStorage.setItem('userId', res.data.userID);
          sessionStorage.setItem('token', res.data.token);
          // this.router.navigate(['/chatHome']);
        }
      },
      error: (err) => {
        console.log(err);
        this.sweetAlert.error(err.message);
      },
    });
  }
}
