import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './RadioButton.scss';

const RadioButton = ({ isActive, text, handleToggle }: {
    isActive: boolean,
    text: string,
    handleToggle: (val: boolean) => void,
}) => {

    const [active, setActive] = React.useState<boolean>(isActive);

    const handleToggleClick = () => {
        handleToggle(!active);
        setActive(!active)
    };

    return (
        <div className="RadioButton-Wrapper">
            <div className="RadioButton-Outer">
                <div
                    tabIndex={0}
                    role="radio"
                    aria-checked={active}
                    className={`RadioButton ${active ? 'RadioButton-Active' : ''
                        }`}
                    onClick={handleToggleClick}
                    onKeyPress={handleToggleClick}
                />
            </div>
            <span className="RadioButton-Text">{text}</span>
        </div>
    );
}

export default RadioButton;
