import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log('here is the server', this.server);
    console.log('this client is connected', client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log('this client disconnected', client.id);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, payload: any) {
    this.server.emit('receiveMessage', payload);
  }
}
