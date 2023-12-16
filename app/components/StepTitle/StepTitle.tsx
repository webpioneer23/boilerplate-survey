import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './StepTitle.scss';

const StepTitle = ({ title = '' }: { title: string }) => {

    return <section className="StepTitle" dangerouslySetInnerHTML={{ __html: title }} />;
}

StepTitle.propTypes = {
    title: PropTypes.string,
};



export default StepTitle;
