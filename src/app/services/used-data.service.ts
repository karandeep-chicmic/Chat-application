import { Injectable, signal } from '@angular/core';
import { dataBySearch } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsedDataService {
  token = signal(false);
  username = signal('');

  dataBySearch: dataBySearch[] = [];

  
  constructor() {}
}
