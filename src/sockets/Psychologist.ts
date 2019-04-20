import Socket from './Socket';

class PsychologistSocket extends Socket {

  public static listen(): void {
    this.server.of('/psychologist').on('connect', (socket) => {
      socket.join('psychologists');
    });
  }
}