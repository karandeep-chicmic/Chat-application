import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { forgotPass } from '../../../interfaces/user.interface';
import { environment } from '../../../../environments/environment';
import { SweetAlertService } from '../../../services/sweet-alert.service';
import { ApiCallsService } from '../../../services/api-calls.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  formBuilder = inject(FormBuilder);
  sweetAlert = inject(SweetAlertService);
  activatedRoute = inject(ActivatedRoute);
  apiCalls = inject(ApiCallsService);

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    urldirect: [''],
  });

  onSubmit() {
    this.activatedRoute.queryParamMap.subscribe((data)=>{
      console.log(data);
      
    })
    
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
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
