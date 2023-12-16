import React, { Component, useEffect, useState } from 'react';
import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';
import { connect } from 'react-redux';
import {
    selectSkinTone,
    showBrand,
    setUserEmail,
    setUserFirstName,
    setUserIpAddress,
    setUserCommunication,
    setReferrer,
    setDomain,
    setLocale,
    setUserId,
    setIsAuthenticated,
    setJWTToken,
} from 'app/actions';
import axios from 'axios';
import PropTypes from 'prop-types';
import publicIp from 'react-public-ip';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import './SaveMatches.scss';
import Input from '../../components/Input/Input';
import { SaveMatchesProp, SaveMatchesState } from './types';
import { useHistory } from 'react-router-dom';

mixpanel.init(process.env.MIXPANEL_TOKEN);

// class SaveMatches extends Component<SaveMatchesProp, SaveMatchesState> {
const SaveMatches = (props: SaveMatchesProp) => {

    const method = 'user';
    const leadSource = 'elf_cosmetics_webapp';

    const formRef = React.useRef('');

    const [agreement, setAgreement] = useState<boolean>(false);

    const [state, setState] = useState<SaveMatchesState>({
        requestPath: `/results/${props.journeyId}`,
        isNextDisabled: props.photoURLs.filter((photo) => photo.status === 'success').length < parseInt(process.env.MIN_IMAGE_COUNT || '', 10),
        lastIsNextDisabled: null,
        agreementOfMarketingEmail: false,
        contactForm: {
            firstName: '',
            email: '',
            communication: false,
        },
    })

    const history = useHistory();



    useEffect(() => {
        getIp()
        activateNextButton();
        const searchParams = new URLSearchParams(props.location.search);

        if (searchParams.get('email')) {
            props.setUserEmail(searchParams.get('email'));
            setState({
                ...state,
                contactForm: {
                    ...state.contactForm,
                    email: searchParams.get('email'),
                },
            });
        }

    }, [])

    const getIp = () => {
        publicIp.v4()
            .then((ip) => {
                setState({ ...state, ipAddress: ip });
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    }

    const saveCustomer = () => {
        // These requests should be moved to a middleware as they have a side effects.
        // Keeping side-effects here leads to hacks like this `preferredSkinTone` argument
        const imageList = props.photoURLs.filter((image) => image.status === 'success').map((item) => item.imageURL);

        const userEmail = state.contactForm.email;
        const userFirstName = state.contactForm.firstName;
        const userIpAddress = state.ipAddress || '127.0.0.1';

        axios({
            method: 'patch',
            url: `${process.env.ENDPOINT_URL + method}/`,
            headers: {
                Authorization: props.jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                ipAddress: userIpAddress,
                signature: process.env.API_SIGNATURE,
                client_user: process.env.CLIENT_USER,
                country: props.country,
                images: imageList,
                foundations: props.foundationList,
                colorPreference: props.preferredSkinTone,
                firstName: userFirstName,
                emailAddress: userEmail,
                optIn: props.communication ? 'active' : 'Transactional',
                leadSource: leadSource,
                undertone: '', // Hardcoded after adding survey steps
                coverage: props.coverage,
                utm_referral_source: props.referrer,
                domain: props.domain,
                locale: props.locale,
                queryParams: props.queryParams,
                tosAcceptedByIp: userIpAddress,
                consentOptIn: true,
                mimecid: props.mimecid,
                marketingOptIn: state.agreementOfMarketingEmail,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    mixpanel.identify(props.mimecid);
                    mixpanel.track('Completed Lead Gen Form', { customer: process.env.CLIENT_USER });
                    ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || '');
                    ReactGA.event({
                        category: 'User',
                        action: 'Completed Lead Gen Form',
                    });
                }
                // if (response.data.success && response.data.userId) {
                //     this.props.setUserId(response.data.userId);
                //     mixpanel.identify(response.data.mimecid);
                // }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                if (error?.response?.status === 401) {
                    props.setIsAuthenticated(false);
                    history.push('/?refresh=true');
                }
            });
    }


    const activateNextButton = () => {
        console.log('current', state)
        if (formRef.current?.checkValidity()) {
            setState({ ...state, nextStep: true });
        } else {
            setState({ ...state, nextStep: false });
        }
    };

    //     static getDerivedStateFromProps(props, state) {
    //     const { photoURLs } = props;
    //     const isNextDisabled = photoURLs.filter((photo) => photo.status === 'success').length < parseInt(process.env.MIN_IMAGE_COUNT || '', 10);
    //     if (isNextDisabled !== state.lastIsNextDisabled) {
    //         return {
    //             isNextDisabled,
    //             lastIsNextDisabled: isNextDisabled,
    //         };
    //     }
    //     // Slight timeout added to allow image to be set and photo being visible
    //     if (!isNextDisabled) {
    //         setTimeout(() => {
    //             // @ts-ignore
    //             // this.nextStep(false);
    //         }, 500);
    //     }
    //     return null;
    // }

    const nextStep = (e?: React.MouseEvent<HTMLElement>, skipStep?: boolean) => {
        if (!formRef.current?.checkValidity()) {
            formRef.current?.reportValidity();
            e?.preventDefault();
            return;
        }

        const {
            ipAddress,
            contactForm: { firstName, email, communication },
        } = state;

        props.setUserEmail(email);
        props.setUserFirstName(firstName);
        props.setUserIpAddress(ipAddress);
        props.setUserCommunication(communication);
        // Get referrer
        const { search } = window.location;
        const params = new URLSearchParams(search);

        const query = new URLSearchParams(props.location.search);
        let brand = query.get('showBrand');
        if (!brand) {
            brand = query.get('brand');
        }
        props.showBrand(brand);

        props.setReferrer(params.get('utm_referral_source'));
        props.setDomain(params.get('domain'));
        props.setLocale(params.get('locale'));

        const { requestPath, skipRequestPath } = state;
        if (e !== undefined) {
            e.preventDefault();
        }

        const { isNextDisabled } = state;
        if (isNextDisabled && skipStep) {
            return;
        }
        saveCustomer();
        history.push(skipStep ? skipRequestPath : requestPath);
    };

    const handleAgreementChange = (status) => {
        // setState({ ...state, agreement: !status });
        setAgreement(!status)
        activateNextButton();
    };

    const handleAgreementOfMarketingChange = (status) => {
        setState({ ...state, agreementOfMarketingEmail: !status });
    };

    const handleInputChange = (key, value) => {
        const { contactForm } = state;
        contactForm[key] = value;
        setState({ ...state, contactForm });
        activateNextButton();
    };

    const { firstName, email } = state.contactForm;
    const { agreementOfMarketingEmail } = state;
    return (
        <div className="SaveMatches">
            <StepCounter step={9} />
            <StepTitle title="SAVE YOUR MATCHES" />
            <section className="Form-Wrapper">
                <form ref={formRef} onSubmit={handleAgreementChange}>
                    {console.log(state.contactForm)}
                    <Input
                        label="Email address"
                        value={email}
                        handleInputChange={(e) => handleInputChange('email', e.target.value)}
                        type="email"
                        required
                    />
                    <Input
                        label="First name"
                        value={firstName}
                        handleInputChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                    />
                    <div className="Options">
                        <div className="Agreement Options-Item">
                            <input
                                type="checkbox"
                                id="agreement"
                                name="agreement"
                                checked={agreement}
                                onChange={() => handleAgreementChange(agreement)}
                                onKeyPress={() => handleAgreementChange(agreement)}
                                required
                            />
                            <label htmlFor="agreement" className="Agreement-Text">
                                By ticking this box and continuing, you agree to the{' '}
                                <a href="https://www.elfcosmetics.com/privacy-policy/privacy-policy.html" className="Privacy" target="_blank">
                                    <u>Privacy Policy</u>, <u>Cookie Policy</u>
                                </a>{' '}
                                and the{' '}
                                <a href="https://www.elfcosmetics.com/terms-of-use/terms.html" className="Terms" target="_blank">
                                    <u>Terms and Conditions</u>
                                </a>
                                . You also confirm that you are at least 16 years of age.
                            </label>
                        </div>
                    </div>
                    <div className="Options">
                        <div className="Agreement Options-Item">
                            <input
                                type="checkbox"
                                id="marketingOptIn"
                                name="marketingOptIn"
                                checked={agreementOfMarketingEmail}
                                onChange={() => handleAgreementOfMarketingChange(agreementOfMarketingEmail)}
                                onKeyPress={() => handleAgreementOfMarketingChange(agreementOfMarketingEmail)}
                            />
                            <label htmlFor="marketingOptIn" className="Agreement-Text">
                                e.l.f. cosmetics may send me marketing emails including deals, promotions or discounts.
                            </label>
                        </div>
                    </div>
                </form>
            </section>
            <Button disabled={!state.nextStep} onClick={(e: React.MouseEvent<HTMLElement>) => nextStep(e)} requestPath={state.requestPath}>
                Next
            </Button>
        </div>
    );
}



const mapStateToProps = (state) => ({
    surveyStepsCount: state.app.surveyStepsCount,
    country: state.app.country,
    photoURLs: state.app.photoURLs,
    foundationList: state.app.foundationList,
    preferredSkinTone: state.app.preferredSkinTone,
    undertone: state.app.undertone,
    ipAddress: state.app.ipAddress,
    firstName: state.app.firstName,
    queryParams: state.app.queryParams,
    email: state.app.email,
    coverage: state.app.coverage,
    communication: state.app.communication,
    referrer: state.app.referrer,
    domain: state.app.domain,
    locale: state.app.locale,
    isAuthenticated: state.app.isAuthenticated,
    jwtToken: state.app.jwtToken,
    mimecid: state.app.mimecid,
    journeyId: state.app.journeyId,
    primaryTone: state.app.primaryTone,
    secondaryTone: state.app.secondaryTone,
    undertoneChoice: state.app.undertoneChoice,
    selfClassifiedComplexion: state.app.shadeCategory,
});

const mapDispatchToProps = (dispatch) => ({
    setLocale: (brand) => {
        dispatch(setLocale(brand));
    },
    setDomain: (brand) => {
        dispatch(setDomain(brand));
    },
    setReferrer: (brand) => {
        dispatch(setReferrer(brand));
    },
    showBrand: (brand) => {
        dispatch(showBrand(brand));
    },
    setUserEmail: (email) => {
        dispatch(setUserEmail(email));
    },
    setUserFirstName: (firstName) => {
        dispatch(setUserFirstName(firstName));
    },
    setUserIpAddress: (ipAddress) => {
        dispatch(setUserIpAddress(ipAddress));
    },
    setUserCommunication: (communication) => {
        dispatch(setUserCommunication(communication));
    },
    selectSkinTone: (skinTone) => {
        dispatch(selectSkinTone(skinTone));
    },
    setUserId: (userId) => {
        dispatch(setUserId(userId));
    },
    setIsAuthenticated: (status) => {
        dispatch(setIsAuthenticated(status));
    },
    setJWTToken: (jwtToken) => {
        dispatch(setJWTToken(jwtToken));
    },
});


SaveMatches.propTypes = {
    showBrand: PropTypes.func,
    country: PropTypes.string,
    domain: PropTypes.string,
    setUserEmail: PropTypes.func,
    location: PropTypes.object,
    locale: PropTypes.string,
    referrer: PropTypes.string,
    photoURLs: PropTypes.array,
    foundationList: PropTypes.array,
    preferredSkinTone: PropTypes.string,
    queryParams: PropTypes.object,
    coverage: PropTypes.array,
    communication: PropTypes.bool,
    history: PropTypes.object,
    setDomain: PropTypes.func,
    setLocale: PropTypes.func,
    setReferrer: PropTypes.func,
    setUserFirstName: PropTypes.func,
    setUserIpAddress: PropTypes.func,
    setUserCommunication: PropTypes.func,
    jwtToken: PropTypes.string,
    mimecid: PropTypes.string,
    setIsAuthenticated: PropTypes.func,
    journeyId: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(SaveMatches);
