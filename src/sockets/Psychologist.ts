import Socket from './Socket';

class PsychologistSocket extends Socket {

  public static listen(): void {
    Socket.server.of('/psychologist').on('connect', (socket) => {
    });
  }
}

export default PsychologistSocket;
