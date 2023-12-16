import React, { useState } from 'react';
import PrivacyTerms from 'components/PrivacyTerms/PrivacyTerms';
import HeroBlock from 'containers/HomePage/HeroBlock/HeroBlock';
import Button from 'components/Button/Button';
import InputCountrySelect from 'components/InputCountrySelect';
import './MobileOnlyErrorPage.scss';
import axios from 'axios';

const MobileOnlyErrorPage = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLinkSent, setLinkSent] = useState(false);
    const { search } = window.location;
    const params = new URLSearchParams(search);

    let textLinkID = process.env.TEXT_LINK_ID;
    if (params.get('domain') === 'com') {
        textLinkID = process.env.TEXT_LINK_ID_COM;
    } else if (params.get('domain') === 'co_uk') {
        textLinkID = process.env.TEXT_LINK_ID_UK;
    }
    return (
        <div className="MobileOnlyErrorPage">
            <HeroBlock />
            <section className="MobileOnlyErrorPage-ErrorDescription">
                <h2>Enter your number and we will send a link to your mobile.</h2>
            </section>
            <section className="MobileOnlyErrorPage-FormContainer">
                {isLinkSent ? (
                    <span className="MobileOnlyErrorPage-FeedbackSent">
                        The link has been sent!
                    </span>
                ) : (
                    <>
                        <InputCountrySelect
                            handleInputChange={phone => setPhoneNumber(phone)}
                        // placeholder="Add your product"
                        />
                        <Button
                            onClick={(event: React.MouseEvent<HTMLElement>) => {
                                event.preventDefault();
                                axios({
                                    method: 'post',
                                    url: 'https://api.linktexting.com/sendLink',
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Access-Control-Allow-Headers': 'sentry-trace, baggage',
                                    },
                                    data: `linkId=${textLinkID
                                        }&number=${phoneNumber}`,
                                })
                                    .then(response => {
                                        setLinkSent(true);
                                    })
                                    .catch(error => {
                                        console.error('error', error);
                                    });
                            }}
                        >
                            Text me the Link
                        </Button>
                    </>
                )}
                <p className="legalCopy">By providing your mobile number you grant permission to elf Cosmetics and MIME to send you a text message with a URL for the foundation finder experience. Your mobile number is not saved. Message and data rates may apply - please check with your carrier.</p>
            </section>
            <PrivacyTerms />
        </div>
    );
};

export default MobileOnlyErrorPage;
