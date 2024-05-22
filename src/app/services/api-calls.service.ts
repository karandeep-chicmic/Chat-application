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

  getUser() {
    return this.http.get(`${API.BASE_URL}${API.USER_GET}`);
  }

  editUser(user: user, id: string) {
    return this.http.put(`${API.BASE_URL}${API.USER_EDIT}?id=${id}`, user);
  }

  updatePassword(passwords: any) {
    return this.http.post(`${API.BASE_URL}${API.UPDATE_PASSWORD}`, passwords);
  }

  setPicture(file: any) {
    return this.http.post(`${API.BASE_URL}${API.SET_IMAGE}`, file);
  }

  saveFileToDb(fileType: number, email: string, file: any) {
    return this.http.post(
      `${API.BASE_URL}${API.SAVE_FILE}?type=${fileType}&Email=${email}`,
      file
    );
  }
}
