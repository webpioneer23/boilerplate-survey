import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
    resetUserData,
    setSku,
    setProductId,
    setGroupId,
    setAffId,
    setPbId,
    setReferrer,
    setDomain,
    setQueryParams,
    setLocale,
    setJWTToken,
    setImageId,
    setJWTRefreshToken,
    setMimecid,
    setIsAuthenticated,
    setUserSurveyStepCount,
    setUserSurveyStep,
    setUserIpAddress,
    setCountryCode,
} from 'app/actions';
import Loader from '../../components/Loader';
import axios from 'axios';
import publicIp from 'react-public-ip';
import iconBack from '../../images/icon-back.png';
import HomeBrand from '../../images/home-brand.png';
import HomeLogo from '../../images/home-logo.png';

import './HomePage.scss';
import { HomePageProps, HomePageState } from './types';
import BrandCard from 'components/BrandCard/BrandCard';

class HomePage extends Component<HomePageProps, HomePageState> {

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        jwtToken: PropTypes.string,
        setSurveyStep: PropTypes.func,
        setMimecid: PropTypes.func,
        setIsAuthenticated: PropTypes.func,
        setJWTToken: PropTypes.func,
        setJWTRefreshToken: PropTypes.func,
        jwtRefreshToken: PropTypes.string,
        setImageId: PropTypes.func,
        queryParams: PropTypes.object,
        setDomain: PropTypes.func,
        setLocale: PropTypes.func,
        setReferrer: PropTypes.func,
        resetUserData: PropTypes.func,
        history: PropTypes.object,
        setSku: PropTypes.func,
        setProductId: PropTypes.func,
        setGroupId: PropTypes.func,
        setAffId: PropTypes.func,
        setPbId: PropTypes.func,
        setQueryParams: PropTypes.func,
        setUserIpAddress: PropTypes.func,
        setCountryCode: PropTypes.func,
    };

    form: React.RefObject<HTMLFormElement>


    constructor(props) {

        super(props);

        this.form = React.createRef();

        this.state = {
            requestPath: '/survey',
            mimeCid: '',
            jwtToken: '',
            jwtRefreshToken: '',
            imageId: '',
            ipAddress: '',
            countryCode: '',
        };

    }

    getIpAddress() {

        publicIp.v4()
            .then((ip) => {

                this.setState({ ipAddress: ip });
                this.props.setUserIpAddress(ip);

                if (!ip) {

                    // eslint-disable-next-line no-console
                    console.log('Error: Could not get IP address.');

                }

            })
            .catch((error) => {

                // eslint-disable-next-line no-console
                console.log(error);

            });

    }

    componentDidMount() {

        //console.log('component mounted')

        /*
        If someone starts all over again, we need to ensure we did not maintain
        certain values in the session which could cause /search and /results to be
        messed up (using previous search values)
        */

        this.props.resetUserData();

        /*
        Get all the query params
        */
        this.getQueryParams();

        const { setSurveyStep } = this.props;

        setSurveyStep(1);

        if (!this.props.isAuthenticated) {

            // eslint-disable-next-line no-console
            //console.log(this.props)

            //console.log('First time user.')

            /*
            //Let's not do this anymore to maintain better sessions
            this.props.setMimecid(null);
            this.props.setJWTToken(null);
            this.props.setImageId(null);
            this.props.setJWTRefreshToken(null);
            */

            /* Only get the IP Address if we do not have it */

            if (!this.state.ipAddress) {
                this.getIpAddress();
                // eslint-disable-next-line no-console
                //console.log('got IP address b/c we did not have it yet.');
            }

            /* Only get the country code if we do not have it */

            if (!this.state.countryCode) {
                this.getGeoInfo();
                // eslint-disable-next-line no-console
                //console.log('got country code b/c we did not have it yet.');
            }

            /**
            *
            Check if this user exists already and needs 
            to refresh otherwise new user
            *
            **/

            var doWeRefresh = new URLSearchParams(this.props.location.search).get("refresh")

            if (this.props.mimecid && this.props.jwtToken) {

                // eslint-disable-next-line no-console
                //console.log('we will begin refresh.');
                this.refreshToken();


            } else {

                this.auth();

                // eslint-disable-next-line no-console
                //console.log('first time user setup');

            }



            //console.log('Authenticated the user.')

            /*this.state = {
                requestPath: '/survey',
            };*/

        } else {

            //auto redirect to survey and don't require another auth
            //or user API call

            // eslint-disable-next-line no-console
            //console.log('user has auth already; dont do it again');
            // this.props.history.push('/survey'); new home page
            this.setState({
                requestPath: '/survey',
            })
            //this.props.history.push(requestPath);

        }

    }


    componentDidUpdate() {

        //console.log('component updated.')

        /*if (this.props.isAuthenticated) {
            console.log('componentDidUpdate() user has auth already; dont do it again');
            this.props.history.push('/survey');
        }*/

        /*if (!this.props.isAuthenticated) {

            console.log('First time user.')

            this.props.setMimecid(null);
            this.props.setJWTToken(null);
            this.props.setImageId(null);
            this.props.setJWTRefreshToken(null);
        
        }*/

    };

    getQueryParams = () => {

        //We use this data on /search and /user API endpoints
        const { search } = window.location;
        const params = new URLSearchParams(search);
        const queryParams = {};

        params.forEach(function placeParameters(value, key) {
            if (!Number.isNaN(Number(value))) {
                queryParams[key] = parseInt(value, 10);
            } else if (value === 'true') {
                queryParams[key] = true;
            } else if (value === 'false') {
                queryParams[key] = false;
            } else {
                queryParams[key] = value;
            }
        });

        this.props.setQueryParams(queryParams);
        this.props.setReferrer(params.get('utm_referral_source'));
        this.props.setDomain(params.get('domain'));
        this.props.setLocale(params.get('locale'));
        this.props.setSku(params.get('sku'));
        this.props.setProductId(params.get('productId'));
        this.props.setGroupId(params.get('groupId'));
        this.props.setAffId(params.get('affId'));
        this.props.setPbId(params.get('pbId'));

    }


    /*
    Todo: We will use nextStep again in the future when we have a 
    landing page again -- not removing the functionality for now
    */

    nextStep = () => {

        const { requestPath } = this.state;

        // Collect URL params for /results page
        const { search } = window.location;
        const params = new URLSearchParams(search);
        const queryParams = {};

        params.forEach(function placeParameters(value, key) {
            if (!Number.isNaN(Number(value))) {
                queryParams[key] = parseInt(value, 10);
            } else if (value === 'true') {
                queryParams[key] = true;
            } else if (value === 'false') {
                queryParams[key] = false;
            } else {
                queryParams[key] = value;
            }
        });

        this.props.setQueryParams(queryParams);
        this.props.setReferrer(params.get('utm_referral_source'));
        this.props.setDomain(params.get('domain'));
        this.props.setLocale(params.get('locale'));
        this.props.setSku(params.get('sku'));
        this.props.setProductId(params.get('productId'));
        this.props.setGroupId(params.get('groupId'));
        this.props.setAffId(params.get('affId'));
        this.props.setPbId(params.get('pbId'));
        this.props.history.push(requestPath);

    };


    /*
    Get the IP address country info
    */
    getGeoInfo = () => {
        axios.get('https://ipapi.co/json/?key=TVf8FRIE1Z4ANhED9TiV9z9UU9urnx4TX44uuXDMIouRkv5H6X').then((response) => {
            const { data } = response;
            // eslint-disable-next-line no-console
            // console.log(data);
            this.setState({
                countryCode: data.country_code
            });
            this.props.setCountryCode(data.country_code);
        }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
        });
    };

    /**
     * Create Anonymous user
     */
    anonymousUser(authData) {

        //console.log(authData)

        const cleanCountryCode = this.state.countryCode || 'US';
        const cleanIpAddress = this.state.ipAddress || '127.0.0.1';
        const cleanToken = this.props.jwtToken || authData.jwtAccessToken;

        //console.log(cleanToken)

        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL}user`,
            headers: {
                Authorization: cleanToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                leadSource: process.env.LEAD_SOURCE,
                /* /tosAcceptedByIp: this.state.ipAddress, */
                tosAcceptedByIp: cleanIpAddress,
                countryCode: cleanCountryCode,
                domain: window.location.hostname,
                consentOptIn: true,
                queryParams: this.props.queryParams,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    this.props.setMimecid(response.data.mimecid);
                    this.setState({
                        requestPath: '/survey',
                    })
                    // this.props.history.push('/survey'); // new home page
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
                if (error) {
                    this.props.setIsAuthenticated(false);
                    this.props.history.push('/');
                }
            });

    }

    /**
     * 
     * Authentication
     * 
     **/

    auth() {
        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL}auth`,
            headers: {
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                clientKey: process.env.CLIENT_KEY,
                retailerId: process.env.RETAILER_ID,
            },
        })
            .then((response) => {
                if (response.data.jwtAccessToken) {

                    this.props.setIsAuthenticated(true);

                    //console.log(response.data)

                    this.props.setJWTToken(response.data.jwtAccessToken);
                    //this.setState({jwtToken: response.data.jwtAccessToken});

                    //console.log('jwt props: '+this.props.jwtToken)

                    this.props.setJWTRefreshToken(response.data.jwtRefreshToken);
                    //this.setState({jwtRefreshToken: response.data.jwtRefreshToken});

                    //console.log('jwtR props: '+this.props.jwtRefreshToken)

                    //console.log('/auth OK');
                    this.anonymousUser(response.data);
                }
            })
            .catch((error) => {

                // eslint-disable-next-line no-console
                console.log(error);

            });
    }

    /**
     * JWT Refresh Token
     */
    refreshToken() {

        // eslint-disable-next-line no-console
        //console.log('jwtToken: '+this.props.jwtToken)

        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL}refresh`,
            headers: {
                Authorization: this.props.jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                jwtRefreshToken: this.props.jwtRefreshToken,
                retailerId: process.env.RETAILER_ID,
            },
        })
            .then((response) => {

                // eslint-disable-next-line no-console
                //console.log(response);

                if (response.data.jwtAccessToken) {

                    this.props.setIsAuthenticated(true);

                    this.props.setJWTToken(response.data.jwtAccessToken);

                    this.props.setJWTRefreshToken(response.data.jwtRefreshToken);

                    //Send user back to survey and do not get new mimecid from /user
                    //since we want to reuse same session and not duplicate

                    // eslint-disable-next-line no-console
                    //console.log('Token refreshed; maintaining customer journey.');
                    this.setState({
                        requestPath: '/survey?tokenRefreshed=true',
                    })
                    // this.props.history.push('/survey?tokenRefreshed=true'); // new home page

                }

            })
            .catch((error) => {

                // eslint-disable-next-line no-console
                console.log(error)

                //Could not refresh the user
                //Unset mimecid and go get a new one
                this.props.setMimecid(null);

                //Get another user and send back to /survey
                this.auth();

                // eslint-disable-next-line no-console
                //console.log('Could not refresh token; created new customer journey.');

                // eslint-disable-next-line no-console
                //console.log(error);

            });
    }




    render() {

        const { requestPath } = this.state

        const mainContent = (
            <div className="home-content">
                <p>This Charlotte Tilbury Beauty shade finder experience is brought to you in collaboration with MIME.</p>
                <p className='mt-3'>By continuing, you agree to both parties’ <Link className="btn-link" to="/legal">Terms and Conditions</Link> and <Link className="btn-link" to="/legal">Privacy Policies.</Link></p>
            </div>
        )

        const actionSection = (
            <>
                <Link to={requestPath} className='btn btn-primary' >I AGREE, LET’S BEGIN!</Link>
                <Link to="/" className="btn btn-secondary mt-2">NO THANKS</Link>
            </>
        )

        return (
            <div className='HomePage'>
                <BrandCard title="CHARLOTTE’S EXPERT FOUNDATION FINDER" backText="Back to Charlotte Tilbury" backLink="/" mainContent={mainContent} actionSection={actionSection} />
            </div>
        )


        return <Loader step={1} />;


        //return <div onLoad={this.nextStep()} />
        //return <div></div>

    }
}
/*
HomePage.propTypes = {
    setDomain: PropTypes.func,
    setLocale: PropTypes.func,
    setReferrer: PropTypes.func,
    resetUserData: PropTypes.func,
    history: PropTypes.object,
    setSku: PropTypes.func,
    setProductId: PropTypes.func,
    setGroupId: PropTypes.func,
    setAffId: PropTypes.func,
    setPbId: PropTypes.func,
    setQueryParams: PropTypes.func,
};
*/

const mapStateToProps = (state) => ({
    surveyStepsCount: state.app.surveyStepsCount,
    country: state.app.country,
    countryCode: state.app.countryCode,
    ipAddress: state.app.ipAddress,
    isAuthenticated: state.app.isAuthenticated,
    queryParams: state.app.queryParams,
    jwtToken: state.app.jwtToken,
    jwtRefreshToken: state.app.jwtRefreshToken,
    mimecid: state.app.mimecid,
});

const mapDispatchToProps = (dispatch) => ({
    setSurveyStep: (step) => {
        dispatch(setUserSurveyStep(step));
    },
    setCountryCode: (countryCode) => {
        dispatch(setCountryCode(countryCode));
    },
    setLocale: (brand) => {
        dispatch(setLocale(brand));
    },
    setDomain: (brand) => {
        dispatch(setDomain(brand));
    },
    setReferrer: (brand) => {
        dispatch(setReferrer(brand));
    },
    setSku: (sku) => {
        dispatch(setSku(sku));
    },
    setProductId: (productId) => {
        dispatch(setProductId(productId));
    },
    setQueryParams: (queryParams) => {
        dispatch(setQueryParams(queryParams));
    },
    setGroupId: (groupId) => {
        dispatch(setGroupId(groupId));
    },
    setAffId: (affId) => {
        dispatch(setAffId(affId));
    },
    setPbId: (pbId) => {
        dispatch(setPbId(pbId));
    },
    setIsAuthenticated: (status) => {
        dispatch(setIsAuthenticated(status));
    },
    setJWTToken: (jwtToken) => {
        dispatch(setJWTToken(jwtToken));
    },
    setMimecid: (mimecid) => {
        dispatch(setMimecid(mimecid));
    },
    setJWTRefreshToken: (jwtRefreshToken) => {
        dispatch(setJWTRefreshToken(jwtRefreshToken));
    },
    setImageId: (imageId) => {
        dispatch(setImageId(imageId));
    },
    setUserIpAddress: (ipAddress) => {
        dispatch(setUserIpAddress(ipAddress));
    },
    resetUserData: () => dispatch(resetUserData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
