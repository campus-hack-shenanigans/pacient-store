import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
// tslint:disable-next-line:import-name
import createError, { HttpError } from 'http-errors';

import PatientController from './controllers/Patient.controller';
import PsychologistController from './controllers/Psychologist.controller';

import Socket from './sockets/Socket';
// tslint:disable-next-line:import-name
import PatientSocket from './sockets/Patient';
// tslint:disable-next-line:import-name
import PsychologistSocket from './sockets/Psychologist';

import { PORT } from './config';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
Socket.init(server);
app.use(cors({
  origin: '*',
  methods: '*',
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

PatientController.route(app, '/api/patient');
PsychologistController.router(app, '/api/psychologist');

// Not found error.
app.use((req, res, next) => {
  next(createError(404, 'Not found.'));
});

// Handle errors.
app.use((err: HttpError & Error, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send(err.message);
});

server.listen(PORT, (err: Error) => {
  if (err) {
    throw err;
  }
  PatientSocket.listen();
  PsychologistSocket.listen();
  console.log(`App is listening on port ${PORT}`);
});
