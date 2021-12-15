import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { environment } from '../../environments/environment';
import { Message } from '../types/message.interface';

@Injectable({
  providedIn: 'root'
})

export class SocketService {

  // Our socket connection
  private socket!: Socket;

  constructor() { }

  connect(): Subject<Message> {
    // If you aren't familiar with environment variables then
    // you can hard code `environment.ws_url` as `http://localhost:5000`
    this.socket = io(environment.ws_url);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable<Message>(observer => {
        this.socket.on('message', (data: Message) => {
          console.log("Received message from Websocket Server")
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
            this.socket.emit('message', JSON.stringify(data));
        },
        error: (err: any) => { console.log(err); },
        complete: () => { this.socket.disconnect() },
    };

    // observable.subscribe(observer)

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return new AnonymousSubject<Message>(observer, observable);
  }

}
