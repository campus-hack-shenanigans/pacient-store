import express from 'express';
import bodyParser from 'body-parser';

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

app.listen(PORT, (err: Error) => {
  if (err) {
    throw err;
  }
  console.log(`App is listening on port ${PORT}`);
});
