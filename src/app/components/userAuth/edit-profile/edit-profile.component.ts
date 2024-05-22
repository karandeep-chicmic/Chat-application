import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiCallsService } from '../../../services/api-calls.service';
import {
  QUERY_PARAMS,
  ROUTES,
  STATUS_CODES,
} from '../../../constants/allConstants';
import { user } from '../../../interfaces/user.interface';
import { SweetAlertService } from '../../../services/sweet-alert.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  formBuilder: FormBuilder = inject(FormBuilder);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  router: Router = inject(Router);
  sweetAlert: SweetAlertService = inject(SweetAlertService);

  regexPhoneNo = '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$';
  editUserOrPass = false; //false for edit true for change password

  form: FormGroup = this.formBuilder.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNo: ['', [Validators.required, Validators.pattern(this.regexPhoneNo)]],
    dateOfBirth: ['', [Validators.required]],
  });

  formPassword: FormGroup = this.formBuilder.group({
    oldPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data) => {
      console.log(data);
      if (data['page'] === QUERY_PARAMS.EDIT_USER) {
        this.editUserOrPass = false;

        this.apiCalls.getUser().subscribe({
          next: (data: any) => {
            this.form.patchValue({
              firstName: data?.data?.firstName,
              lastName: data?.data?.lastName,
              email: data?.data?.email,
              phoneNo: data?.data?.phoneNo,
              dateOfBirth: data?.data?.dateOfBirth,
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.editUserOrPass = true;
      }
    });
  }

  onSubmit() {
    const userObj: user = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNo: this.form.controls['phoneNo'].value,
      dateOfBirth: this.form.controls['dateOfBirth'].value,
    };

    // get id from storage
    const id: string = sessionStorage.getItem('userId') ?? '';

    this.apiCalls.editUser(userObj, id).subscribe({
      next: (data: any) => {
        console.log(data);
        this.sweetAlert.success(data.message);
        this.router.navigate([ROUTES.PROFILE]);
      },
      error: (err) => {
        this.sweetAlert.error(err.message);
        console.log(err);
      },
    });
  }
  onSubmitPassword() {
    const passwordObj = {
      oldPassword: this.formPassword.controls['oldPassword'].value,
      newPassword: this.formPassword.controls['newPassword'].value,
    };

    console.log(passwordObj);

    this.apiCalls.updatePassword(passwordObj).subscribe({
      next: (data: any) => {
        if (data.statusCode === STATUS_CODES.SUCCESS) {
          this.sweetAlert.success(data.message);
          this.router.navigate([ROUTES.PROFILE]);
        } else {
          this.sweetAlert.error(data.message);
        }
      },
      error: (err) => {
        this.sweetAlert.error(err.message);
        console.log(err);
      },
    });
  }
}
