import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API } from '../constants/allConstants';
import { forgotPass, user } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  constructor() {}
  http = inject(HttpClient);

  registerUser(userInForm: user): Observable<any> {
    return this.http.post(API.BASE_URL + API.REGISTRATION, userInForm);
  }

  loginUser(userInForm: user): Observable<any> {
    return this.http.post(API.BASE_URL + API.LOGIN, userInForm);
  }

  forgotPass(user: forgotPass) {
    return this.http.post(API.BASE_URL + API.FORGOT_PASS, user);
  }

  changePassword(password: user, token: string) {
    return this.http.post(API.BASE_URL + API.RESET_PASS, password, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // To search a user on based of a search string
  searchUser(searchItem: string) {
    return this.http.get(API.BASE_URL + API.SEARCH_STRING + searchItem);
  }

  logoutUser() {
    return this.http.post(API.BASE_URL + API.LOGOUT_USER, {});
  }

  getUser(id?: string) {
    return this.http.get(`${API.BASE_URL}${API.USER_GET}?id=${id}`);
  }
}
