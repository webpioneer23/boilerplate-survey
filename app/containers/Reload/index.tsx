import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { history } from 'history'
import { useHistory } from 'react-router-dom'

const Reload = () => {

    const requestPath = '/survey';

    const history = useHistory();
    return <div onLoad={history.push(requestPath)} />;
}


export default Reload;
