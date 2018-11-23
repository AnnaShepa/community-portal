import {Request, Response} from '../../../config/Types';
import IController from '../../api/IController';
import SurveyModel from '../model/Survey';
import SurveyEntity from '../entity/Survey';

export default class LoadSurveyController implements IController {

	public execute(req: Request, res: Response) {

        let surveyModel = new SurveyModel();
        surveyModel.getByCode('contribution')
            .then((entity:SurveyEntity) => res.status(200).json({
                error: false,
                id: req.params.id,
                pr_id: req.params.pr_id,
                res: entity
            }))
            .catch((err: any) => {
                res.status(200).json({
                    error: true,
                    message: err
                })
            });
	}
}