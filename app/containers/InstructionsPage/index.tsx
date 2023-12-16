import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import './InstructionsPage.scss';
import selfieStraight from '../../images/icons/full-face-straight/full-face-straight.jpg';
import selfieStraight2x from '../../images/icons/full-face-straight/full-face-straight@2x.jpg';
import selfieStraight3x from '../../images/icons/full-face-straight/full-face-straight@3x.jpg';
import harshShadows from '../../images/icons/harsh-shadows/harsh-shadows.jpg';
import harshShadows2x from '../../images/icons/harsh-shadows/harsh-shadows@2x.jpg';
import harshShadows3x from '../../images/icons/harsh-shadows/harsh-shadows@3x.jpg';
import noGlass from '../../images/icons/no-glass/no-glass.jpg';
import noGlass2x from '../../images/icons/no-glass/no-glass@2x.jpg';
import noGlass3x from '../../images/icons/no-glass/no-glass@3x.jpg';
import noGroupPhotos from '../../images/icons/no-group-photos/no-group-photos.jpg';
import noGroupPhotos2x from '../../images/icons/no-group-photos/no-group-photos@2x.jpg';
import noGroupPhotos3x from '../../images/icons/no-group-photos/no-group-photos@3x.jpg';
import simpleBg from '../../images/icons/simple-backgrounds/simple-backgrounds.jpg';
import simpleBg2x from '../../images/icons/simple-backgrounds/simple-backgrounds@2x.jpg';
import simpleBg3x from '../../images/icons/simple-backgrounds/simple-backgrounds@3x.jpg';

mixpanel.init(process.env.MIXPANEL_TOKEN);
mixpanel.track('Viewed Instructions Page', { customer: process.env.CLIENT_USER });
ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || '');
ReactGA.event({
    category: 'User',
    action: 'Viewed Instructions Page',
});

const InstructionsPage: React.FC = () => {

    const requestPath = '/photo-upload';

    const surveyStepsCount = useSelector(state => state.app.surveyStepsCount);

    return (
        <div className="InstructionsPage">
            <StepCounter step={7} />
            <StepTitle title="INSTRUCTIONS FOR TAKING YOUR BEST SELFIE FOR THE LAST STEP" />
            <p>Tips to get your best match</p>
            <ul className="List">
                <li className="List-Item">
                    <img className="Selfie-Example" alt="" src={selfieStraight} srcSet={`${selfieStraight2x} 2x, ${selfieStraight3x} 3x`} />
                    <div className="List-Item-Instructions">
                        <span>Look straight to camera</span>
                        <span>Use natural light</span>
                    </div>
                </li>
                <li className="List-Item">
                    <img className="Selfie-Example" alt="" src={simpleBg} srcSet={`${simpleBg2x} 2x, ${simpleBg3x} 3x`} />
                    <div className="List-Item-Instructions">
                        <span>Try to avoid makeup</span>
                        <span>Choose a simple background</span>
                    </div>
                </li>
                <li className="List-Item Notice">
                    <img className="Selfie-Example" alt="" src={harshShadows} srcSet={`${harshShadows2x} 2x, ${harshShadows3x} 3x`} />
                    <div className="List-Item-Instructions">
                        <span>Avoid harsh shadows</span>
                        <span>No filters, save that for Snapchat</span>
                    </div>
                </li>
                <li className="List-Item Notice">
                    <img className="Selfie-Example" alt="" src={noGlass} srcSet={`${noGlass2x} 2x, ${noGlass3x} 3x`} />
                    <div className="List-Item-Instructions">
                        <span>If safe to do so, remove your mask and other accessories</span>
                        <span>Avoid strong light towards your back</span>
                    </div>
                </li>
                <li className="List-Item Notice">
                    <img className="Selfie-Example" alt="" src={noGroupPhotos} srcSet={`${noGroupPhotos2x} 2x, ${noGroupPhotos3x} 3x`} />
                    <span>One at a time please, no group photos :)</span>
                </li>
            </ul>
            <Button requestPath={requestPath}>Next</Button>
        </div>
    );
}

export default InstructionsPage;