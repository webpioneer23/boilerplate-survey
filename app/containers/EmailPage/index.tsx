import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes, { any } from 'prop-types';
import { setJourneyId, setIsAuthenticated } from 'app/actions';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import './EmailPage.scss';
import envelopeIcon from '../../images/icons/envelope-black/mail-message-icon-1.png';
import envelopeIcon2x from '../../images/icons/envelope-black/mail-message-icon-1@2x.png';
import envelopeIcon3x from '../../images/icons/envelope-black/mail-message-icon-1@3x.png';
import lockKeyHole from '../../images/icons/lock-key-hole/icon-lock-small.png';
import lockKeyHole2x from '../../images/icons/lock-key-hole/icon-lock-small@2x.png';
import lockKeyHole3x from '../../images/icons/lock-key-hole/icon-lock-small@3x.png';
import Loader from '../../components/Loader';
import { EmailPageProp, EmailPageState } from './types';

const EmailPage = () => {

    const [state, setState] = useState({
        requestPathEmail: '/save',
        requestPathResult: `/results`,
        resultId: null,
    })

    const dispatch = useDispatch();


    const countryCode = useSelector(state => state.app.countryCode)
    const coverage = useSelector(state => state.app.coverage)
    const imageId = useSelector(state => state.app.imageId)
    const journeyId = useSelector(state => state.app.journeyId)
    const jwtToken = useSelector(state => state.app.jwtToken)
    const mimecid = useSelector(state => state.app.mimecid)
    const preferredSkinTone = useSelector(state => state.app.preferredSkinTone)
    const primaryTone = useSelector(state => state.app.primaryTone)
    const productId = useSelector(state => state.app.productId)
    const selfClassifiedComplexion = useSelector(state => state.app.shadeCategory)
    const undertone = useSelector(state => state.app.undertone)
    const undertoneChoice = useSelector(state => state.app.undertoneChoice)


    const setSetJourneyId = (journeyId) => {
        dispatch(setJourneyId(journeyId));
    };
    const setIsAuthenticated = (status) => {
        dispatch(setIsAuthenticated(status));
    };

    const history = useHistory();

    useEffect(() => {
        getJourneyId()
    }, [])


    const getJourneyId = () => {
        const coverageLocal = coverage.map((filter) => filter.toLowerCase());

        /* Need better handling since undertone is optional */
        // const undertone = this.props.undertoneChoice.map((filter) => filter.toLowerCase()).toString();
        let undertoneLocal = '';


        if (undertoneChoice && undertoneChoice.length === 1 && undertoneChoice[0]) {
            undertoneLocal = undertoneChoice[0].toLowerCase();
        }


        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL}search`,
            headers: { 'Content-Type': 'application/json', Authorization: jwtToken, 'Access-Control-Allow-Headers': 'sentry-trace, baggage', },
            data: {
                mimecid: mimecid,
                imageId: imageId,
                primaryColor: primaryTone,
                coverage: coverageLocal,
                colorPreference: preferredSkinTone,
                countryCode: countryCode,
                incomingProductSku: productId,
                undertone: undertoneLocal,
                selfClassifiedComplexion: selfClassifiedComplexion.toLowerCase(),
            },
        })
            .then((response) => {
                setSetJourneyId(response.data.journeyId);
                setState({ ...state, requestPathResult: response.data.nextStep, resultId: response.data.journeyId });
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    setIsAuthenticated(false);
                    history.push('/?refresh=true');
                }
            });
    }

    return (
        <div className="EmailPage">
            <StepCounter step={8} />
            <StepTitle title="YOUR RESULTS ARE READY!" />
            <StepTitle title="WANT US TO EMAIL YOU" />
            <StepTitle title="THEM TOO?" />
            <div className="EnvelopeIcon">
                <img src={envelopeIcon} srcSet={`${envelopeIcon2x} 2x, ${envelopeIcon3x} 3x`} alt="Check" />
            </div>
            <p>98% of customers save their results with</p>
            <p>an email address.</p>
            <div className="EmailMYResult">
                <Button requestPath={state.requestPathEmail}>
                    EMAIL MY RESULTS
                </Button>
            </div>
            <div className="lockIcon">
                <img src={lockKeyHole} srcSet={`${lockKeyHole2x} 2x, ${lockKeyHole3x} 3x`} alt="Lock key Hole" />
            </div>
            <p>Your email goes to elf cosmetics and is</p>
            <p>never sold.</p>
            <div className="NoThanks">
                <Button requestPath={state.requestPathResult}>
                    NO THANKS, JUST SHOW MY RESULTS
                </Button>
            </div>
        </div>
    );
}

export default EmailPage;

