import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InputLabel.scss';


const InputLabel = ({ label = '', required = false }: { label: string, required: boolean }) => {
    return (
        <p className={`Input-Label ${required ? 'required' : ''}`}>
            {label}
        </p>
    );
}

InputLabel.propTypes = {
    required: PropTypes.bool,
    label: PropTypes.string
}


export default InputLabel;
