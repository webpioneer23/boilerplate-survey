import React, { Component, useState } from 'react';
import './Coupon.scss';
import axios from 'axios';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import spinner from '../../../images/mime-loader.gif';
import Button from '../../../components/Button/Button';

const Coupon: React.FC = () => {

    const method = 'getCouponCode';

    const [state, setState] = useState({
        coupon: '',
        showCoupon: true,
    })

    const fetchCouponCode = (e) => {
        e.preventDefault();
        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL + method}/`,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Headers': 'sentry-trace, baggage', },
            data: {
                signature: process.env.API_SIGNATURE,
                client_user: process.env.CLIENT_USER,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    setState({
                        ...state,
                        coupon: response.data.code,
                    });
                } else {
                    setState({
                        ...state,
                        showCoupon: false,
                    });
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error(error);
                setState({
                    ...state,
                    showCoupon: false,
                });
            });
    }


    if (!state.coupon) {
        return (
            <div className="Coupon-Wrapper" hidden={!state.showCoupon}>
                <img className="ResultsPage-Spinner" src={spinner} alt="Loading Results..." />
            </div>
        );
    }

    return (
        <div className="Coupon-Wrapper">
            <p className="Coupon-Text">
                <b>Coupon unlocked!</b> You unlocked <b>FREE SHIPPING</b> on this Camo CC Cream when you buy today!
            </p>
            <div className="Coupon-CodeBox">
                <p className="Coupon-CodeBox-Text">{state.coupon}</p>
                <CopyToClipboard text={state.coupon}>
                    <span className="Coupon-CodeBox-Copy" />
                </CopyToClipboard>
            </div>
        </div>
    );
}

export default Coupon;
