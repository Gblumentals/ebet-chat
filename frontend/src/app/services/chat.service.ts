import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Subject, map } from 'rxjs';
import { Message } from '../types/message.interface';

@Injectable({
  providedIn: 'root'
})

export class ChatService {

  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: SocketService) {
    this.messages = <Subject<any>>wsService
      .connect()

      map((response: any): any => {
        return response;
      })
   }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendMsg(msg: Message) {
    this.messages.next(msg);
  }

}

// import { Injectable } from '@angular/core';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class ChatService {
//
//   constructor() { }
// }
