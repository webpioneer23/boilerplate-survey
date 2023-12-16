import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Button.scss';

interface ButtonProp {
    children?: React.ReactNode
    requestPath?: string
    disabled?: boolean
    onClick?: (e?: React.MouseEvent<HTMLElement>) => void
    className?: string
}

const Button = ({ children, className, onClick, disabled, requestPath = "/" }: ButtonProp) => {
    return (
        <section className="Button-Wrapper">
            <Link to={requestPath} className={(disabled ? 'hold' : '') + ' Button ' + className} disabled={disabled} onClick={onClick} >
                {children}
            </Link>
        </section>
    )
}

export default Button;
