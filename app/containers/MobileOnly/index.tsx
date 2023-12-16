import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isMobile from 'ismobilejs';

const MobileOnly = ({ children }) => {

    const isMobileScreen = isMobile().any;

    if (isMobileScreen) {
        return children;
    }

    return null;
}

export default MobileOnly;
