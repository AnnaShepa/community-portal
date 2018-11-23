import {LOAD_START, LOAD_END} from '../types/survey';

export default function project(state = [], action:any) {
    switch (action.type) {
        case LOAD_START:
            return {
                ...state,
                survey_loading: true
            };
        case LOAD_END:
            return {
                ...state,
                survey_loading: false,
                survey_entity: action.survey,
                surveyTest: 'test2'
            };
        default:
            return state;
    }
}
