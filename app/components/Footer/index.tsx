import React, { Component } from 'react';
import logo from '../../images/logo/logo-footer.png';
import logo2x from '../../images/logo/logo-footer@2x.png';
import logo3x from '../../images/logo/logo-footer@3x.png';
import './Footer.scss';

const Footer = () => {
    return (
        <div className="Footer">
            <div className="Logo">
                <span className="Logo-Text">Powered by</span>
                <a href={process.env.FOOTER_LOGO_URL} target="_blank">
                    <img
                        className="Logo-Image"
                        alt=""
                        src={logo}
                        srcSet={`${logo2x} 2x, ${logo3x} 3x`}
                    />
                </a>
            </div>
        </div>
    );
}

export default Footer;
