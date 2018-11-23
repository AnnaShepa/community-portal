import {Dispatch} from "redux";
import {LOAD_START, LOAD_END} from "../types/survey";
import {API, headers, request} from "../api/Config";

export const loadSurvey = (id:any, pr_id:any) => (dispatch:Dispatch) => {
    dispatch({
        type: LOAD_START
    });

    return request(`${API}/survey/load/${id}/${pr_id}`, headers())
        .then((result: any) => {
            dispatch({
                type: LOAD_END,
                survey: result,
            });
        });
};