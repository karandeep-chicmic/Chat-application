import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { user } from '../../interfaces/user.interface';
import { ApiCallsService } from '../../services/api-calls.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  apiCalls: ApiCallsService = inject(ApiCallsService);
  data: user[] = [];
  ngOnInit(): void {
    const id = sessionStorage.getItem('userId') ?? '';
    this.apiCalls.getUser(id).subscribe((data: any) => {
      this.data = data?.data;
    });
  }
}
