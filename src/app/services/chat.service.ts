import { Injectable, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { SIGNALR_API } from '../constants/allConstants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  router = inject(Router);

  constructor() {
    this.startConnection();

    this.connection?.on('refresh', () => {
      console.log('it is in refresh');
    });

    this.connection?.on('receiveMessage', (data) => {
      console.log("Message Received");
      
      console.log(data);
    });
  }

  token: string = localStorage.getItem('token') ?? '';

  public connection: signalR.HubConnection | undefined;

  private async startConnection() {
    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${SIGNALR_API.BASE_URL}?access_token=${this.token}`, {
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

  public async addchat(email: string) {
    return this.connection?.invoke('addchat', email);
  }

  public async previousMessages(mapId: string, pageNumber: number) {
    return this.connection?.invoke('previousMessages',  mapId, pageNumber );
  }

  public async leave() {
    return this.connection?.stop();
  }
}
