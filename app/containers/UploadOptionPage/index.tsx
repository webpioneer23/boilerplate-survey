import React, { Component } from 'react';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import './UploadOptionPage.scss';
import risingStar from '../../images/icons/rising-stars/icon-stars.png';
import risingStar2x from '../../images/icons/rising-stars/icon-stars@2x.png';
import risingStar3x from '../../images/icons/rising-stars/icon-stars@3x.png';
import lockKeyHole from '../../images/icons/lock-key-hole/icon-lock-small.png';
import lockKeyHole2x from '../../images/icons/lock-key-hole/icon-lock-small@2x.png';
import lockKeyHole3x from '../../images/icons/lock-key-hole/icon-lock-small@3x.png';

const UploadOption = () => {
    const requestPathWelcome = '/email';
    const requestPathPhotoUpload = `/photo-upload`;
    const requestPathInstructor = '/instructions';

    return (
        <div className="WelcomePage">
            <StepCounter step={6} />
            <StepTitle title="ADD A PHOTO TO INCREASE" />
            <StepTitle title="YOUR COLOR MATCH" />
            <StepTitle title="ACCURACY" />
            <div className="EnvelopeIcon">
                <img src={risingStar} srcSet={`${risingStar2x} 2x, ${risingStar3x} 3x`} alt="Rising Star" />
            </div>
            <div className="firstSubTitle">
                <p>Over 2,000,000 customers have taken a photo to find their perfect match.</p>
            </div>
            <div className="secondSubTitle">
                <p>
                    <img src={lockKeyHole} srcSet={`${lockKeyHole2x} 2x, ${lockKeyHole3x} 3x`} alt="Lock key Hole" /> Your photo is anonymized and
                    secure.
                </p>
            </div>
            <div className="TakePhoto">
                <Button requestPath={requestPathInstructor}>
                    TAKE A PHOTO
                </Button>
            </div>
            <div className="UploadPhoto">
                <Button requestPath={requestPathPhotoUpload}>
                    UPLOAD A PHOTO
                </Button>
            </div>
            <div className="NoThanks">
                <Button requestPath={requestPathWelcome}>
                    NO THANKS, JUST RESULTS
                </Button>
            </div>
        </div>
    );
}

export default UploadOption;
