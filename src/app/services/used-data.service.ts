import { Injectable, signal } from '@angular/core';
import { dataBySearch } from '../interfaces/user.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { DEFAULT_USER_IMG } from '../constants/allConstants';

@Injectable({
  providedIn: 'root',
})
export class UsedDataService {
  token = signal(false);
  username = signal('');
  userImageDetails = signal(DEFAULT_USER_IMG.IMAGE)

  dataBySearch = new Subject<dataBySearch[]>();

  constructor() {}
}
