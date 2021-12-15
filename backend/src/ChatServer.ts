import * as express from 'express';
import { Socket, Server as IOServer } from 'socket.io';
import { ChatEvent } from './constants';
import { ChatMessage } from './types';
import { createServer, Server } from 'http';
import * as cors from 'cors';


export class ChatServer {
  public static readonly PORT: number = 8080;
  private _app: express.Application;
  private server: Server;
  private ioOptions: Object;
  private io: IOServer;
  private port: string | number;

  constructor () {
    this._app = express();
    this.port = process.env.PORT || ChatServer.PORT;
    this._app.use(cors());
    this._app.options('*', cors());
    this.server = createServer(this._app);
    this.initSocket();
    this.listen();
  }

  private initSocket (): void {
    this.ioOptions = {
      cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST"],
        // auth headers here
      }
    }

    this.io = new IOServer(this.server, this.ioOptions);
  }

  private listen (): void {
    this.server.listen(this.port, () => {
      console.log('Running server on port %s', this.port);
    });

    this.io.on(ChatEvent.CONNECT, (socket: Socket) => {
      console.log('Connected client on port %s.', this.port);


      socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
        console.log('[server](message): %s', JSON.stringify(m));
        this.io.emit('message', m);
      });

      socket.on(ChatEvent.DISCONNECT, () => {
        console.log('Client disconnected');
      });
    });
  }

  get app (): express.Application {
    return this._app;
  }
}
