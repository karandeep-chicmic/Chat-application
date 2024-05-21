import { Component, inject, OnInit } from '@angular/core';
import { user } from '../../interfaces/user.interface';
import { ApiCallsService } from '../../services/api-calls.service';
import { DatePipe, JsonPipe } from '@angular/common';
import {
  API,
  DEFAULT_USER_IMG,
  QUERY_PARAMS,
  ROUTES,
} from '../../constants/allConstants';
import { UsedDataService } from '../../services/used-data.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [JsonPipe, DatePipe, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  // All the injected services 
  apiCalls: ApiCallsService = inject(ApiCallsService);
  router: Router = inject(Router);
  usedData: UsedDataService = inject(UsedDataService);

  // All the variables
  data: user = {};
  imageUrl: string = '';

  // Lifecycle hooks
  ngOnInit(): void {
    this.apiCalls.getUser().subscribe((data: any) => {
      this.data = data?.data;
      this.imageUrl = API.BASE_URL + '/' + data.data.profileImagePath;
      if (data.data.profileImagePath === '') {
        this.imageUrl = DEFAULT_USER_IMG.IMAGE;
      }
    });
  }

  // ALL methods
  editProfileNav() {
    this.router.navigateByUrl(
      `${ROUTES.EDIT_USER_PASSWORD}?page=${QUERY_PARAMS.EDIT_USER}`
    );
  }

  changePass() {
    this.router.navigateByUrl(
      `${ROUTES.EDIT_USER_PASSWORD}?page=${QUERY_PARAMS.CHANGE_PASS}`
    );
  }
}
