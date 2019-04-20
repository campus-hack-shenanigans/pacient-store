import { Application, Request, Response, Router } from 'express';

import StoreClient from './StoreClient';

abstract class PatientController {
  private static store: StoreClient = new StoreClient();

  private static addPatient(req: Request, res: Response) {
    PatientController.store.addPatient({
      name: req.body.name,
      problem: req.body.problem,
      details: req.body.details,
    }).then(patient => res.status(200).send(patient))
      .catch(err => res.status(400).send(err));
  }

  private static getPatient(req: Request, res: Response) {
    PatientController.store.getPatient(req.params.id)
      .then(patient => res.status(200).send(patient))
      .catch(err => res.status(400).send(err.message));
  }

  private static deletePatient(req: Request, res: Response) {
    PatientController.store.popPatient(req.params.id)
      .then(patient => res.status(200).send(patient))
      .catch(err => res.status(400).send(err.message));
  }

  private static getPatients(req: Request, res: Response) {
    PatientController.store.getPatients()
      .then(patients => res.status(200).send(patients))
      .catch(err => res.status(400).send(err.message));
  }

  public static route(app: Application, route: string): void {
    const router = Router();

    router.get('/', PatientController.getPatients);
    router.post('/', PatientController.addPatient);
    router.get('/:id', PatientController.getPatient);
    router.delete('/:id', PatientController.deletePatient);

    app.use(route, router);
  }
}

export default PatientController;
