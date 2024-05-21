import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SIGNALR_API } from '../constants/allConstants';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  router = inject(Router);
  public messageSubject = new BehaviorSubject<any>(null);
  public messages$ = this.messageSubject.asObservable();

  constructor() {
    this.startConnection();

      this.connection?.on('refresh', () => {
        console.log('it is in refresh');
      });

    this.connection?.on('receiveMessage', (data) => {
      console.log('Message Received', data);
      this.messageSubject.next(data);
    });
  }

  token: string = sessionStorage.getItem('token') ?? '';

  public connection: signalR.HubConnection | undefined;

  public async startConnection() {
    try {
      const token: string = sessionStorage.getItem('token') || '';
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${SIGNALR_API.BASE_URL}?access_token=${token}`, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      await this.connection.start();
      console.log('SignalR Connected');
    } catch (error) {
      console.log('ERROR IS : ' + error);
    }
  }

  public async sendMessage(
    email?: string,
    msg?: string,
    type?: number,
    url?: string,
    fileName?: string
  ) {
    return this.connection?.invoke(
      'sendMessage',
      email,
      msg,
      type,
      url,
      fileName
    );
  }

  public async addChat(email: string) {
    return this.connection?.invoke('addchat', email);
  }

  public async previousMessages(mapId: string, pageNumber: number) {
    return this.connection?.invoke('previousMessages', mapId, 0);
  }
  public async getUsers() {
    return this.connection?.invoke('getUsers');
  }
  public async leave() {
    return this.connection?.stop();
  }
}
