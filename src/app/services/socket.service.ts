import { Injectable, Inject } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import {Agent} from '../classes/agent';
import {Address} from '../classes/address';
import {Site} from '../classes/site';

@Injectable()
export class SocketService {
  private url = 'http://localhost:8000';
  private socket;
  private agents: Agent[] = [];
  constructor(@Inject('API_ENDPOINT') private apiEndpoint: string) {
    this.socket = io(apiEndpoint);
  }

  public sendMessage(typeMessage: string, message: any) {
    this.socket.emit(typeMessage, message);
  }
  public getMobileActiveUsers(): Observable<Agent> {
    return Observable.create((observer) => {
      this.socket.on('update_position', (message: Agent) => {
        const agent = new Agent(message.latitude, message.longitude, message.id, message.username, message.first_name, message.last_name, message.entitle, message.usertype, message.password, message.zonerights, message.address, message.teamright, message.siteright, message.picture, message.team);
        observer.next(agent);
      });
    });
  }
}
