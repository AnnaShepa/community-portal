import Endpoint from './../../../src/EndpointWrapper';
import { Request, Response } from "../../../config/Types";
import LoadSurveyController from '../../../src/survey/controller/LoadSurvey'

const LoadSurveyEndpoint = new Endpoint('/survey/load/:id/:pr_id', 'get');

LoadSurveyEndpoint.configure((req: Request, res: Response) => {
  const loadSurveyController = new LoadSurveyController();
    loadSurveyController.execute(req, res);
});

export const handler = LoadSurveyEndpoint.execute();
