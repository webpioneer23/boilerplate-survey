import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '../InputLabel/InputLabel';
import './Input.scss';

interface InputProp {
    label: string,
    placeholder?: string,
    type?: string,
    value: string | null,
    handleInputChange: (val: React.ChangeEvent<HTMLInputElement>) => void,
    required: boolean,
}


const Input = ({
    label = '',
    placeholder = '',
    type = 'text',
    value,
    handleInputChange,
    required = false }: InputProp) => {

    return (
        <div className="Input-Wrapper">
            <InputLabel label={label} required={required} />
            <input
                type={type}
                placeholder={placeholder}
                className="Input-Field"
                value={value || ''}
                onChange={handleInputChange}
                required={required}
            />
        </div>
    );
}


Input.propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    handleInputChange: PropTypes.func.isRequired,
    required: PropTypes.bool,
}
export default Input;
