import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiCallsService } from '../../services/api-calls.service';
import { UsedDataService } from '../../services/used-data.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  usedData = inject(UsedDataService);
  apiCalls = inject(ApiCallsService);
  router = inject(Router);


  ngOnInit(): void {
    this.usedData.token.set(sessionStorage.getItem('token') ? true : false);

  }

  logout() {
    this.apiCalls.logoutUser().subscribe({
      next: () => {
        this.usedData.token.set(false);
        sessionStorage.clear();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log('ERRRRRRRR', err);
      },
    });
  }
}
