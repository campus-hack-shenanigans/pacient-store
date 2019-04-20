import redis from 'redis';

interface Patient {
  name: string;
  problem: string;
  details: string;
}

interface PatientEntry extends Patient {
  id: number;
}

class StoreClient {
  private client: redis.RedisClient;

  constructor(options?: object) {

    this.client = options ? redis.createClient(options) : redis.createClient();
    this.client.flushall((err) => {
      if (err) {
        throw err;
      }
      if (!this.client.set('id', '0')) {
        throw Error('Couldn\'t initialise id counter');
      }
    });
  }

  public addPatient(patient: Patient): Promise<PatientEntry> {
    return new Promise<PatientEntry>((resolve, reject) => {
      this.client.incr('id', (err, id) => {
        if (err) {
          reject(err);
          return;
        }
        const query = this.client.multi();
        // @ts-ignore
        query.hmset(`patient:${id}`, {
          id,
          ...patient,
        });
        // tslint:disable-next-line:prefer-template
        query.sadd('active_patients', id + '');
        query.exec((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            id,
            ...patient,
          });
        });
      });
    });
  }

  public getPatient(id: number): Promise<PatientEntry> {
    return new Promise<PatientEntry>((resolve, reject) => {
      this.client.hgetall(`patient:${id}`, (err, patient) => {
        if (err) {
          reject(err);
          return;
        }
        if (!patient) {
          reject(Error('Patient doesn\'t exist.'));
          return;
        }
        // @ts-ignore
        resolve(patient);
      });
    });
  }

  public popPatient(id: number): Promise<PatientEntry> {
    return new Promise<PatientEntry>((resolve, reject) => {
      this.getPatient(id)
        .then((patient) => {
          const query = this.client.multi();
          query.del(`patient:${id}`);
          // tslint:disable-next-line:prefer-template
          query.srem('active_patients', id + '');
          query.exec((err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(patient);
          });
        })
        .catch(err => reject(err));
    });
  }

  public getPatients(): Promise<PatientEntry[]> {
    return new Promise<PatientEntry[]>((resolve, reject) => {
      this.client.smembers('active_patients', (err, patientIds) => {
        if (err) {
          reject(err);
          return;
        }
        const query = this.client.multi();
        // tslint:disable-next-line:prefer-const
        for (let id of patientIds) {
          query.hgetall(`patient:${id}`);
        }
        query.exec((err, patients) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(patients);
        });
      });
    });
  }
}

export default StoreClient;
