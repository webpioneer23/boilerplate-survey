import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { setUserSurveyStep } from '../../containers/App/actions';
import Button from '../Button/Button';
import * as H from 'history';
import { RouteProps } from 'react-router';
import './Header.scss';
import { match } from 'types';
import { useHistory } from 'react-router-dom'

interface HeaderProp<P> {
    step: number
    setSurveyStep: (val: number) => void
    history: H.History
    location: RouteProps["location"],
    match: match<P>,
}

interface MatchParams {
    name: string;
}

const Header: React.FC = () => {
    const step = useSelector(state => state.app.surveyStep);

    const dispatch = useDispatch();

    const setSurveyStep = dispatch(setUserSurveyStep(step));

    const history = useHistory();

    const backStep = (e, location) => {
        e.preventDefault();

        if (location === '/') {
            e.preventDefault();

            return;
        }

        if (location === '/survey') {
            setSurveyStep(step - 1);
            history.push('/survey/r');

            return;
        }

        history.goBack();
    }
    return (
        <div className="Header">
            {/*<div className="Back-Wrapper">
                <Button
                    disabled={step === 1 || location.pathname === '/results'}
                    onClick={(e) => this.backStep(e, location.pathname)}
                    requestPath={this.props.match.url}
                >
                    Back
                </Button>
            </div>*/}
        </div>
    );

}

export default Header;
