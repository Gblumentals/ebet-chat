import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';
import { Message } from './types/message.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'frontend';

  constructor(private chat: ChatService){ }

  ngOnInit() {
    this.chat.messages.subscribe((msg: Message) => {
      console.log(msg);
    })
  }

  sendMessage() {
    this.chat.sendMsg("Test Message");
  }
}
