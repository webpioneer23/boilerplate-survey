import React, { Component } from 'react';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';
import PropTypes from 'prop-types';
import './Product.scss';
import axios from 'axios';
import { ProductProps, ProductState } from '../types';

mixpanel.init(process.env.MIXPANEL_TOKEN);

const Product: React.FC<ProductProps> = (props) => {

    const method = 'event';

    const redirectProduct = (url) => {
        window.location = url;
    }

    const backgroundStyle = (item) => {
        const hasShade = Object.prototype.hasOwnProperty.call(item, 'shadeColor');

        if (hasShade) {
            return {
                backgroundImage: `url(${item.shadeColor})`,
            };
        }

        return {};
    }

    const renderOutOfStockNotice = (productUrl) => {
        return (
            <div className="Product-OutOfStockNotice">
                <span className="Product-OutOfStockIcon">!</span>
                <span>Out of stock - </span>
                <a className="Product-JoinWaitlist" href={productUrl}>
                    Join the waitlist
                </a>
            </div>
        );
    }


    const activityTrack = (e, item) => {

        e.preventDefault();

        mixpanel.track(
            'Clicked to View Product',
            {
                id: item.id,
                title: item.name,
                brand: item.brandName,
                shadeName: item.shadeName,
                domain: window.location.hostname,
                price: item.priceFormatted,
                currency: item.currency,
                finish: item.finish,
                coverage: item.coverage,
                undertone: item.undertone,
                skintype: item.skintype,
                client_user: process.env.CLIENT_USER,
                retailer: process.env.CLIENT_USER,
            },
            () => {
                // eslint-disable-next-line no-console
                //console.log('Clicked button.');
            },
        );

        ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || '');
        ReactGA.event({
            category: 'User',
            action: 'Clicked to View Product',
        });

        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL + method}`,
            headers: {
                Authorization: props.jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                mimecid: props.mimecid,
                eventType: 'Clicked to View Product',
                value: 'clicked',
                retailerId: 'elf-cosmetics',
                dataPayload: {
                    productId: item.id,
                    brand: item.brandName,
                    coverage: item.coverage,
                    finish: item.finish,
                    price: item.price,
                    eventType: 'Clicked to View Product',
                },
            },
        })
            .then((response) => {
                if (response.data.success) {
                    window.location = item.productUrl;
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    }

    const renderAddToBasket = (item, isFeatured) => {
        const label = isFeatured ? 'CHOOSE SHADE' : 'CHOOSE SHADE';
        return (
            <div className="Product-AddToBasketWrapper">
                <a href={item.productUrl} className="Product-AddToBasketButton" onClick={(e) => activityTrack(e, item)}>
                    {label}
                </a>
            </div>
        );
    }

    const {
        item,
        isFeatured,
        item: { out_of_stock: outOfStock },
    } = props;

    const featuredClass = () => {
        isFeatured ? 'Product-Item__Featured' : ''
    }

    return (
        <div className={`Product-Item ${featuredClass()}`}>
            <div className="Product-Description-Block">
                <div className={`Product-Image ${item.imageUrl ? 'loaded' : ''}`}>
                    <img srcSet={item.imageUrl} alt={item.name} />
                </div>
            </div>
            <div className="Product-Description-Block Product-Description-Block__right">
                <div role="button" tabIndex={0} className="Product-Info">
                    <p className="Product-Name">
                        {`${item.name} - ${item.pricing?.priceFormatted}`}
                        <br />
                        <b className="Product-ExtraBold">{`Shade: ${item.color}`}</b>
                    </p>
                </div>
                <div className="Product-ControlBar">
                    {!outOfStock ? renderOutOfStockNotice(item.productUrl) : renderAddToBasket(item, isFeatured)}
                </div>
            </div>
        </div>
    );
}



const mapStateToProps = (state) => ({
    jwtToken: state.app.jwtToken,
    mimecid: state.app.mimecid,
});


Product.propTypes = {
    item: PropTypes.object.isRequired,
    isFeatured: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Product);