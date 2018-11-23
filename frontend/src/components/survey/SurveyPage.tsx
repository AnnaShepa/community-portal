import * as React from 'react';
import {loadSurvey} from "../../actions/survey";
import compose from "recompose/compose";
import { connect } from 'react-redux';

interface DispatchProps {
    loadSurvey: any,
    surveyLoading: false,
    surveyTest: 'test'
}

class SurveyPage extends React.Component<any, any> {

    constructor(props: DispatchProps) {
        super(props);
    }

    componentDidMount() {
        this.props.loadSurvey('contribution', 12534);
    }

    render() {
        return (
            <div>
                Survey {this.props.surveyTest} 1
            </div>
        );
    }
}

export default compose<{}, any>(
    connect<DispatchProps>(null, {loadSurvey}),
)(SurveyPage);
