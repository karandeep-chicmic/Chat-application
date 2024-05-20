import { Injectable, signal } from '@angular/core';
import { dataBySearch } from '../interfaces/user.interface';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsedDataService {
  token = signal(false);
  username = signal('');

  dataBySearch = new Subject<dataBySearch[]>();

  constructor() {}
}
