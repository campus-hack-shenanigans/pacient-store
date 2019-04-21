import Socket from './Socket';
import StoreClient from '../StoreClient';

class PatientSocket {
  private static store: StoreClient = new StoreClient();

  public static listen(): void {
    Socket.server.of('/patient').on('connect', (socket) => {
      // Broadcast change in pacient list to psychologists.
      Socket.server.of('/psychologist').emit('patientsChanged', true);
      // Move patient to an identifiable room.
      socket.on('patientId', (id) => {
        // @ts-ignore
        socket.identifier = id;
        socket.join(`patient-${id}`);
      });
      socket.on('pairFound', (psychologistId) => {
        socket.emit('pairFound', psychologistId);
      });
      socket.on('disconnect', () => {
        // @ts-ignore
        PatientSocket.store.popPatient(socket.identifier);
        // Broadcast change in pacient list to psychologists.
        Socket.server.of('/psychologist').emit('patientsChanged', true);
      });
    });
  }
}

export default PatientSocket;
