import Socket from './Socket';

class PatientSocket extends Socket  {

  public static listen(): void {
    this.server.of('/patient').on('connect', (socket) => {
      // Broadcast change in pacient list to psychologists.
      this.server.to('psychologists').emit('pacientsChanged', true);
      // Move patient to an identifiable room.
      socket.on('pacientId', (id) => {
        socket.join(`pacient-${id}`);
      });
      socket.on('disconnect', () => {
        // Broadcast change in pacient list to psychologists.
        this.server.to('psychologists').emit('pacientsChanged', true);
      });
    });
  }
}

export default PatientSocket;
