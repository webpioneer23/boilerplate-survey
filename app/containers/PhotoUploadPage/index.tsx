import React, { Component, useEffect, useState } from 'react';
import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import AddPhoto from './AddPhoto/AddPhoto';
import './PhotoUploadPage.scss';
import { PhotoIndexProps, PhotoIndexState } from './types';
import { useHistory } from 'react-router-dom'


mixpanel.init(process.env.MIXPANEL_TOKEN);
mixpanel.track('Viewed Photo Upload Page', { customer: process.env.CLIENT_USER });

ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || '');
ReactGA.event({
    category: 'User',
    action: 'Viewed Photo Upload Page',
});



const PhotoUploadPage: React.FC = () => {
    const photoURLs = useSelector(state => state.app.photoURLs);

    const history = useHistory();

    const [state, setState] = useState({
        skipRequestPath: '/email',
        requestPath: '/email',
        isNextDisabled: photoURLs.filter((photo) => photo.status === 'success').length < parseInt(process.env.MIN_IMAGE_COUNT || '', 10),
        isSkipDisabled:
            photoURLs.filter((photo) => photo.status === 'pending' || photo.status === 'fail').length <
            parseInt(process.env.MIN_IMAGE_COUNT || '', 10),
        lastIsNextDisabled: false,
        lastIsSkipDisabled: false,
    })


    const method = 'save';
    const leadSource = 'elf_cosmetics_webapp';

    useEffect(() => {
        setState({
            ...state,
            isNextDisabled: photoURLs.filter((photo) => photo.status === 'success').length < parseInt(process.env.MIN_IMAGE_COUNT || '', 10),
        })
    }, [photoURLs])

    const nextStep = (e, skipStep) => {
        const { requestPath, skipRequestPath } = state;
        if (e !== undefined) {
            e.preventDefault();
        }

        const { isNextDisabled } = state;

        if (isNextDisabled && !skipStep) {
            return;
        }
        history.push(skipStep ? skipRequestPath : requestPath);
    };



    return (
        <div className="PhotoUploadPage">
            <StepCounter step={7} />
            <StepTitle title="Please take a selfie photo for the perfect match" />
            <AddPhoto />
            <Button disabled={state.isNextDisabled} onClick={(e) => nextStep(e, false)} requestPath={state.requestPath}>
                {state.isNextDisabled ? (
                    <div className="PhotoUploadPage-ButtonText">
                        <p>NEXT</p>
                    </div>
                ) : (
                    'NEXT'
                )}
            </Button>
            <div className="Skip-Step">
                <Button disabled={!state.isSkipDisabled || !state.isNextDisabled} onClick={(e) => nextStep(e, true)} requestPath={state.requestPath}>
                    Skip Photo
                </Button>
            </div>
        </div>
    );
}

export default PhotoUploadPage;
