import React from 'react';
import PropTypes from 'prop-types';

function Loader(props: { step: number, loadingText: string }) {
    const { step, loadingText } = props;
    let extraClass = '';
    if (typeof step !== 'undefined' && step) {
        extraClass = `SurveyPage-${step}`;
    }
    return (
        <div className={`SurveyPage ${extraClass}`}>
            <section className="Loader">
                <h2>{loadingText}</h2>
            </section>
        </div>
    );
}

Loader.propTypes = {
    step: PropTypes.number,
    loadingText: PropTypes.string,
};

Loader.defaultProps = {
    step: 0,
    loadingText: 'LOADING...',
};

export default Loader;
