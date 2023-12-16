import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './StepCounter.scss';
import { connect, useSelector } from 'react-redux';

const StepCounter = ({ step = 0, stepLabel = '' }: {
    step?: number,
    stepLabel?: string,
}) => {

    const stepsTotal = useSelector(state => state.app.surveyStepsCount)
    return stepLabel ? (
        <section className="StepCounter">
            {/*<a href={process.env.HEADER_LOGO_URL} target="_blank">
                Home
            </a>{' '}
            - <Link to="/">Shade Finder</Link> - */}{stepLabel}
        </section>
    ) : (
        <section className="StepCounter">
            {/*<a href={process.env.HEADER_LOGO_URL} target="_blank">
                Home
            </a>{' '}
            - <Link to="/">Shade Finder</Link> - */}Step {step} / {stepsTotal + 1}
        </section>
    );
}

StepCounter.propTypes = {
    step: PropTypes.number,
    stepLabel: PropTypes.string,
};

export default StepCounter;