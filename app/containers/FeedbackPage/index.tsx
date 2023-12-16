import React, { Component, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import './FeedbackPage.scss';
import { FeedbackPageProp, FeedbackPageState } from './types';
import { setIsAuthenticated } from 'app/actions';
import { useHistory, useLocation } from 'react-router-dom'
import { consoleSandbox } from '@sentry/utils';

interface MatchParams {
    name: string;
}

const FeedbackPage: React.FC = () => {
    const method = 'rate';
    const voteMethod = 'rate';
    const shopNowURL = 'https://www.elfcosmetics.com/';

    const dispatch = useDispatch();
    const setIsAuthen = (status) => dispatch(setIsAuthenticated(status));
    const appState = useSelector(state => state.app);
    const { isAuthenticated, jwtToken } = appState;

    const [state, setState] = useState<{
        mimecid: string | null
        loading: boolean
        submitted: boolean
        vote: number
        product?: {
            productColor?: string
            imageURL?: string
            brand?: string
            name?: string
            productId?: string
            shade?: string
        }
        purchaseId: string | null
        searchId: string | null
        voteSummitedFailedStatus: boolean
    }>({
        mimecid: null,
        loading: true,
        submitted: false,
        vote: 0,
        product: {},
        purchaseId: null,
        searchId: null,
        voteSummitedFailedStatus: false,
    })

    const history = useHistory();

    useEffect(() => {
        loadProduct();
    }, [])

    const loadProduct = () => {
        const { search } = window.location;
        const params = new URLSearchParams(search);
        setState({
            ...state,
            mimecid: params.get('mimecid'),
            vote: parseInt(params.get('vote') || '0'),
            purchaseId: params.get('purchaseId'),
            searchId: params.get('searchId'),
        });

        axios({
            method: 'get',
            url: `${process.env.ENDPOINT_URL + method}`,
            headers: {
                Authorization: jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            params: {
                mimecid: params.get('mimecid'),
            },
        })
            .then((response) => {
                if (response.data.success) {
                    if (response.data.product) {
                        const { product } = response.data;
                        setState({
                            ...state,
                            product: {
                                productColor: product.color,
                                imageURL: product.imageUrl,
                                brand: product.brandName,
                                name: product.name,
                                productId: product.id,
                            },
                        });
                    }
                    if (state.vote) {
                        setState({ ...state, submitted: true });
                        sendFeedback();
                    }
                }
                setState({ ...state, loading: false });
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    setIsAuthen(false);
                    history.push('/?refresh=true');
                }
            });
    }

    /**
     * Send feedback
     */
    const sendFeedback = () => {
        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL + voteMethod}`,
            headers: {
                Authorization: jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                mimecid: state.mimecid,
                rating: state.vote,
                searchId: state.searchId,
                productId: state.product?.productId,
                purchaseId: state.purchaseId,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    console.log('success')
                    setState({ ...state, submitted: true });
                }
            })
            .catch((error) => {
                if (error?.response?.status === 401) {
                    setIsAuthen(false);
                    history.push('/?refresh=true');
                } else {
                    setState({ ...state, submitted: true, voteSummitedFailedStatus: true });
                }
            });
    }

    /**
     * @param matchType
     */
    const voteBox = async (matchType) => {
        setState({
            ...state,
            vote: matchType,
        })
        await sendFeedback();
    }


    const location = useLocation();



    return (
        <div className={`FeedbackPage ${state.loading ? 'LOADING' : ''}`}>
            <StepCounter stepLabel="Rate your match" />
            <StepTitle title="HOW WELL DID THE FOUNDATION MATCH YOUR SKIN TONE?" />
            <div className="Product">
                <div className="Product-Sample">
                    <span className="Product-Sample-Text">{state.product?.shade}</span>
                </div>
                <div className="productImage">
                    <div className="Image-Wrapper">
                        <img alt="" src={state.product?.imageURL} />
                    </div>
                </div>
                <div className="Product-Info">
                    <p className="Product-Name">{state.product?.name}</p>
                    <span className="Product-Description">By {state.product?.brand}</span>
                </div>
            </div>
            <div className="voteBox">
                {!state.submitted ? (
                    <section className="Selection">
                        <Button onClick={() => voteBox('Perfect Match')} requestPath={location.pathname}>
                            Perfect Match
                        </Button>
                        <Button onClick={() => voteBox('Too Dark')} requestPath={location.pathname}>
                            Too Dark
                        </Button>
                        <Button onClick={() => voteBox('Too Light')} requestPath={location.pathname}>
                            Too Light
                        </Button>
                    </section>
                ) : (
                    <>
                        {!state.voteSummitedFailedStatus ? (
                            <div className="Thank-You">
                                <span>Feedback saved!</span>
                                <p>Thank you!</p>
                            </div>
                        ) : (
                            <div className="Failed-To-Submit">
                                <span>We cannot save your rating at this time. Please try again</span>
                            </div>
                        )}
                    </>
                )}
            </div>
            <p>Want to see new products?</p>
            <div className="Shop-Now">
                <div className="Button-Wrapper">
                    <a
                        className="Button"
                        href="https://www.elfcosmetics.com/?utm_source=mime&utm_medium=webapp&utm_campaign=matchme&utm_content=rating-shop-now-button"
                    >
                        Shop Now
                    </a>
                </div>
            </div>
        </div>
    );
}

export default FeedbackPage;

