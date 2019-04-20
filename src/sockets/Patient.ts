import Socket from './Socket';

class PatientSocket {

  public static listen(): void {
    Socket.server.of('/patient').on('connect', (socket) => {
      // Broadcast change in pacient list to psychologists.
      Socket.server.to('psychologists').emit('pacientsChanged', true);
      // Move patient to an identifiable room.
      socket.on('pacientId', (id) => {
        socket.join(`pacient-${id}`);
      });
      socket.on('disconnect', () => {
        // Broadcast change in pacient list to psychologists.
        Socket.server.to('psychologists').emit('pacientsChanged', true);
      });
    });
  }
}

export default PatientSocket;
