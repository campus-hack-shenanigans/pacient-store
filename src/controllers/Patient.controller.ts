import { Application, Request, Response, NextFunction, Router } from 'express';

// tslint:disable-next-line:import-name
import createError from 'http-errors';

import StoreClient from '../StoreClient';

abstract class PatientController {
  private static store: StoreClient = new StoreClient();

  private static addPatient(req: Request, res: Response, next: NextFunction) {
    // tslint:disable-next-line:prefer-const
    let { name, problem, details } = req.body;
    if (!name || name.length <= 0) {
      next(createError(400, 'Name is required.'));
      return;
    }
    if (!problem || problem.length <= 0) {
      next(createError(400, 'Problem is required'));
      return;
    }
    if (!details) {
      details = '';
    }
    PatientController.store.addPatient({
      name,
      problem,
      details,
    }).then(patient => res.status(200).send(patient))
      .catch(err => next(createError(400, err)));
  }

  private static getPatient(req: Request, res: Response, next: NextFunction) {
    PatientController.store.getPatient(req.params.id)
      .then(patient => res.status(200).send(patient))
      .catch(err => next(createError(400, err)));
  }

  private static deletePatient(req: Request, res: Response, next: NextFunction) {
    PatientController.store.popPatient(req.params.id)
      .then(patient => res.status(200).send(patient))
      .catch(err => next(createError(400, err)));
  }

  private static getPatients(req: Request, res: Response, next: NextFunction) {
    PatientController.store.getPatients()
      .then(patients => res.status(200).send(patients))
      .catch(err => next(createError(400, err)));
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
