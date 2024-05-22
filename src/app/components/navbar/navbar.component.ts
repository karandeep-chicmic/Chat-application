import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiCallsService } from '../../services/api-calls.service';
import { UsedDataService } from '../../services/used-data.service';
import { ROUTES } from '../../constants/allConstants';
import { SweetAlertService } from '../../services/sweet-alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  usedData: UsedDataService = inject(UsedDataService);
  apiCalls: ApiCallsService = inject(ApiCallsService);
  sweetAlert: SweetAlertService = inject(SweetAlertService);
  router = inject(Router);
  routeConstants: {
    EDIT_USER_PASSWORD?: string;
  } = {};

  ngOnInit(): void {
    this.usedData.token.set(sessionStorage.getItem('token') ? true : false);
    this.routeConstants = ROUTES;
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to logout!?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiCalls.logoutUser().subscribe({
          next: () => {
            this.usedData.token.set(false);
            sessionStorage.clear();
            this.router.navigate(['/login']);

            this.sweetAlert.success('Successfully Logged out!');
          },
          error: (err) => {
            console.log('ERRRRRRRR', err);
          },
        });
      }
    });
  }
}
