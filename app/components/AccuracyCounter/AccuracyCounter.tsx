import React from 'react';
import PropTypes from 'prop-types';
import './AccuracyCounter.scss';

function AccuracyCounter({ accuracy }: { accuracy: number }) {
    if (!accuracy) {
        return <p className="Survey-Accuracy" />;
    }

    let extraClasses: string[] = [];
    if (accuracy >= 70) {
        extraClasses = ['Accuracy-Percentage__Success'];
    }

    return (
        <p className="Survey-Accuracy">
            Accuracy: <span className={`Accuracy-Percentage ${extraClasses.join(' ')}`}>{accuracy}%</span>
        </p>
    );
}

AccuracyCounter.propTypes = {
    accuracy: PropTypes.number,
};

AccuracyCounter.defaultProps = {
    accuracy: 0,
};

export default AccuracyCounter;
