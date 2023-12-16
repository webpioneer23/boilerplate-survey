import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

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
import axios from 'axios';
import publicIp from 'react-public-ip';

import './HomePage.scss';
import { HomePageProps, HomePageState } from './types';
import BrandCard from 'components/BrandCard/BrandCard';
import { useSelector, useDispatch } from 'react-redux';

const HomePage: React.FC<HomePageProps> = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const isAuthenticated = useSelector(state => state.app.isAuthenticated);
    const queryParams = useSelector(state => state.app.queryParams);
    const jwtToken = useSelector(state => state.app.jwtToken);
    const jwtRefreshToken = useSelector(state => state.app.jwtRefreshToken);
    const mimecid = useSelector(state => state.app.mimecid);

    const [state, setState] = useState<HomePageState>({
        requestPath: '/survey',
        mimeCid: '',
        jwtToken: '',
        jwtRefreshToken: '',
        imageId: '',
        ipAddress: '',
        countryCode: '',
    })

    useEffect(() => {
        //console.log('component mounted')

        /*
        If someone starts all over again, we need to ensure we did not maintain
        certain values in the session which could cause /search and /results to be
        messed up (using previous search values)
        */

        dispatch(resetUserData());

        /*
        Get all the query params
        */
        getQueryParams();


        dispatch(setUserSurveyStep(1))

        if (!isAuthenticated) {

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

            if (!state.ipAddress) {
                getIpAddress();
                // eslint-disable-next-line no-console
                //console.log('got IP address b/c we did not have it yet.');
            }

            /* Only get the country code if we do not have it */

            if (!state.countryCode) {
                getGeoInfo();
                // eslint-disable-next-line no-console
                //console.log('got country code b/c we did not have it yet.');
            }

            /**
            *
            Check if this user exists already and needs 
            to refresh otherwise new user
            *
            **/
            const { search } = window.location;
            var doWeRefresh = new URLSearchParams(search).get("refresh")

            if (mimecid && jwtToken) {

                // eslint-disable-next-line no-console
                //console.log('we will begin refresh.');
                refreshToken();


            } else {

                auth();

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
            setState(prev => ({
                ...prev,
                requestPath: '/survey',
            }))
            //this.props.history.push(requestPath);

        }

    }, [])


    const getIpAddress = () => {
        publicIp.v4()
            .then((ip) => {

                setState((prev: HomePageState) => ({
                    ...prev,
                    ipAddress: ip
                }))

                dispatch(setUserIpAddress(ip))
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


    const getQueryParams = () => {

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

        dispatch(setQueryParams(queryParams as string))
        dispatch(setReferrer(params.get('utm_referral_source') || ''))
        dispatch(setDomain(params.get('domain') || ''));
        dispatch(setLocale(params.get('locale') || ''));
        dispatch(setSku(params.get('sku') || ''));
        dispatch(setProductId(params.get('productId') || ''));
        dispatch(setGroupId(params.get('groupId') || ''));
        dispatch(setAffId(params.get('affId') || ''));
        dispatch(setPbId(params.get('pbId') || ''));

    }


    /*
    Todo: We will use nextStep again in the future when we have a 
    landing page again -- not removing the functionality for now
    */

    const nextStep = () => {

        const { requestPath } = state;

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

        dispatch(setQueryParams(queryParams + ''));
        dispatch(setReferrer(params.get('utm_referral_source') || ''));
        dispatch(setDomain(params.get('domain') || ''));
        dispatch(setLocale(params.get('locale') || ''));
        dispatch(setSku(params.get('sku') || ''));
        dispatch(setProductId(params.get('productId') || ''));
        dispatch(setGroupId(params.get('groupId') || ''));
        dispatch(setAffId(params.get('affId') || ''));
        dispatch(setPbId(params.get('pbId') || ''));
        history.push(requestPath);

    };


    /*
    Get the IP address country info
    */
    const getGeoInfo = () => {
        axios.get('https://ipapi.co/json/?key=TVf8FRIE1Z4ANhED9TiV9z9UU9urnx4TX44uuXDMIouRkv5H6X').then((response) => {
            const { data } = response;
            // eslint-disable-next-line no-console
            // console.log(data);
            setState((prev: HomePageState) => ({
                ...prev,
                countryCode: data.country_code
            }));
            dispatch(setCountryCode(data.country_code));
        }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
        });
    };

    /**
     * Create Anonymous user
     */
    const anonymousUser = (authData) => {

        //console.log(authData)

        const cleanCountryCode = state.countryCode || 'US';
        const cleanIpAddress = state.ipAddress || '127.0.0.1';
        const cleanToken = jwtToken || authData.jwtAccessToken;

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
                queryParams: queryParams,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    dispatch(setMimecid(response.data.mimecid));
                    setState(prev => ({
                        ...prev,
                        requestPath: '/survey',
                    }))
                    // this.props.history.push('/survey'); // new home page
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
                if (error) {
                    dispatch(setIsAuthenticated(false));
                    history.push('/');
                }
            });

    }

    /**
     * 
     * Authentication
     * 
     **/

    const auth = () => {
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

                    dispatch(setIsAuthenticated(true));

                    //console.log(response.data)

                    dispatch(setJWTToken(response.data.jwtAccessToken));
                    //this.setState({jwtToken: response.data.jwtAccessToken});

                    //console.log('jwt props: '+this.props.jwtToken)

                    dispatch(setJWTRefreshToken(response.data.jwtRefreshToken));
                    //this.setState({jwtRefreshToken: response.data.jwtRefreshToken});

                    //console.log('jwtR props: '+this.props.jwtRefreshToken)

                    //console.log('/auth OK');
                    anonymousUser(response.data);
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
    const refreshToken = () => {
        console.log('refresh token')

        // eslint-disable-next-line no-console
        //console.log('jwtToken: '+this.props.jwtToken)

        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL}refresh`,
            headers: {
                Authorization: jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                jwtRefreshToken: jwtRefreshToken,
                retailerId: process.env.RETAILER_ID,
            },
        })
            .then((response) => {

                // eslint-disable-next-line no-console
                //console.log(response);

                if (response.data.jwtAccessToken) {

                    dispatch(setIsAuthenticated(true));

                    dispatch(setJWTToken(response.data.jwtAccessToken));

                    dispatch(setJWTRefreshToken(response.data.jwtRefreshToken));

                    //Send user back to survey and do not get new mimecid from /user
                    //since we want to reuse same session and not duplicate

                    // eslint-disable-next-line no-console
                    //console.log('Token refreshed; maintaining customer journey.');
                    setState(prev => ({
                        ...prev,
                        requestPath: '/survey?tokenRefreshed=true',
                    }))
                    // this.props.history.push('/survey?tokenRefreshed=true'); // new home page

                }

            })
            .catch((error) => {

                // eslint-disable-next-line no-console
                console.log(error)

                //Could not refresh the user
                //Unset mimecid and go get a new one
                dispatch(setMimecid(null));

                //Get another user and send back to /survey
                auth();

                // eslint-disable-next-line no-console
                //console.log('Could not refresh token; created new customer journey.');

                // eslint-disable-next-line no-console
                //console.log(error);

            });
    }


    const mainContent = (
        <div className="home-content">
            <p>This Charlotte Tilbury Beauty shade finder experience is brought to you in collaboration with MIME.</p>
            <p className='mt-3'>By continuing, you agree to both parties’ <Link className="btn-link" to="/legal">Terms and Conditions</Link> and <Link className="btn-link" to="/legal">Privacy Policies.</Link></p>
        </div>
    )

    const actionSection = (
        <>
            <Link to={state.requestPath} className='btn btn-primary' >I AGREE, LET’S BEGIN!</Link>
            <Link to="/" className="btn btn-secondary mt-2">NO THANKS</Link>
        </>
    )

    return (
        <div className='HomePage'>
            <BrandCard title="CHARLOTTE’S EXPERT FOUNDATION FINDER" backText="Back to Charlotte Tilbury" backLink="/" mainContent={mainContent} actionSection={actionSection} />
        </div>
    )
}

export default HomePage;
