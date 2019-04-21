import {
  Request,
  Response,
  NextFunction,
  Router,
  Application,
} from 'express';
import Socket from '../sockets/Socket';

abstract class PsychologistController {

  private static pairWithPatient(req: Request, res: Response, next: NextFunction) {

    Socket.server.of('/patient').to(`patient-${req.params.id}`)
      .emit('pairFound', req.params.psychId);
    res.sendStatus(200);
  }

  public static router(app: Application, route: string) {
    const router = Router();
    router.post('/patient/:id/:psychId', PsychologistController.pairWithPatient);
    app.use(route, router);
  }
}

export default PsychologistController;
