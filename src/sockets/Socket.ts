import socketIo from 'socket.io';
import { Server } from 'http';

class Socket {

  protected static server: socketIo.Server;

  public static init(server: Server) {
    this.server = socketIo(server);
  }
}

export default Socket;
