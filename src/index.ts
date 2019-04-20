import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
// tslint:disable-next-line:import-name
import createError, { HttpError } from 'http-errors';

// tslint:disable-next-line:import-name
import PatientController from './Patient.controller';

import { PORT } from './config';

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

PatientController.route(app, '/patient');

// Not found error.
app.use((req, res, next) => {
  next(createError(404, 'Not found.'));
});

// Handle errors.
app.use((err: HttpError & Error, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).send(err.message);
});

app.listen(PORT, (err: Error) => {
  if (err) {
    throw err;
  }
  console.log(`App is listening on port ${PORT}`);
});
