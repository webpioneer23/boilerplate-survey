import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showBrand } from 'app/actions';
import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';
import Filter from './Filter/Filter';
import ProductList from './ProductList/ProductList';
import StepCounter from '../../components/StepCounter/StepCounter';
import ProgressItem from './ProgressItem/ProgressItem';
import spinner from '../../images/mime-loader.gif';
import './ResultsPage.scss';
import { Product, ResultsPageProps, ResultsPageState } from './types';

const PROGRESS_ITEM_DELAY = 1200;
mixpanel.init(process.env.MIXPANEL_TOKEN);

const ResultsPage = (props) => {

    const { smartId } = props.match.params;
    const method = `results/${smartId}`;
    const filtersMethod = 'filter';
    const resultsPerPage = 25;
    const maxMockProducts = 6;
    const minPrice = 0;
    const maxPrice = 999999;

    const [state, setState] = useState<ResultsPageState>({
        filterReset: false,
        smartId,
        firstLoad: true,
        page: 1,
        minPrice: minPrice,
        maxPrice: maxPrice,
        filterMenuVisible: false,
        products: [],
        filters: {},
        selectedFilters: {
            coverage: props.coverage ? props.coverage.map((filter) => filter.toLowerCase()) : [],
            undertone: [],
            brands: props.showBrand ? [props.showBrand.toLowerCase()] : [],
        },
        complexionType: 'your',
        undertone: '',
        undertoneAPI: '',
        message: '',
        photoIssue: true,
        totalResultApiHitCount: 5,
        currentResultAPiHitCount: 1,
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(props.location.search);

        let brand = (searchParams.get('showBrand') || '').toLowerCase();
        if (!brand) {
            brand = (searchParams.get('brand') || '').toLowerCase();
        }
        if (brand) {
            props.selectBrand(brand);
            setState({
                ...state,
                selectedFilters: { ...state.selectedFilters, brands: [brand] },
            });
        }
        setState({
            ...state,
            products: Array.from({ length: maxMockProducts }, () => ({})),
        });
        //this.loadFilters();
        // Call when userId was already stored
        if (props.userId || state.smartId) {
            // this.loadProducts(brand ? [brand] : []);
            loadProducts();
        }
    }, [])

    useEffect(() => {
        loadProducts();
    }, [props.userId, state.filterReset])


    const loadFilters = () => {
        axios({
            method: 'get',
            url: `${process.env.ENDPOINT_URL + filtersMethod}?retailerId=${process.env.CLIENT_USER}`,
            headers: {
                Authorization: props.jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            params: {
                retailerId: process.env.CLIENT_USER
            },
        })
            .then((response) => {
                if (response.data.success) {
                    setState({
                        ...state,
                        filters: response.data.filters,
                    });
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error.response);
            });
    }

    //    loadProducts(brands) {
    const loadProducts = () => {
        const normalizedFilterNames = Object.getOwnPropertyNames(state.selectedFilters).reduce((accumulator, filterName) => {
            let normalizedName = filterName
                .split(' ')
                .map((word) => word[0].toUpperCase() + word.slice(1))
                .join('');
            normalizedName = normalizedName[0].toLowerCase() + normalizedName.slice(1);

            if (!state.selectedFilters[filterName].filter(Boolean).length) {
                return accumulator;
            }
            return {
                [normalizedName]: state.selectedFilters[filterName].map((filter) => filter.toLowerCase()).toString(),
                ...accumulator,
            };
        }, {});

        // eslint-disable-next-line react/prop-types
        const undertone = '';
        if (props.undertoneChoice.length > 0 && props.undertoneChoice[0] != null) {
            const undertone = props.undertoneChoice.map((filter) => filter.toLowerCase()).toString();
        }

        // const brandsToFilter = (brands || this.state.selectedFilters.brands || []).map(brand => brand.toLowerCase());
        // const singleBrandFilter = brandsToFilter.length === 1 ? brandsToFilter[0] : '';
        //  const brandFilter = brandsToFilter.length > 0 ? brandsToFilter : [];
        axios({
            method: 'get',
            url: `${process.env.ENDPOINT_URL + method}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: props.jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            params: {
                ...normalizedFilterNames,
                primaryColor: props.primaryTone.toString().toLowerCase(),
                mimecid: props.mimecid,
                priceMin: state.minPrice,
                priceMax: state.maxPrice,
                page: state.page,
                resultsPerPage: resultsPerPage,
                utm_referral_source: props.referrer,
                sku: props.sku,
                productId: props.productId,
                groupId: props.groupId,
                affId: props.affId,
                pbId: props.pbId,
                referring_host_url: '',
                domain: window.location.hostname,
                imageId: props.imageId,
                undertone,
                acceptedBiometrics: props.acceptedBiometrics
            },
        })
            .then((response) => {
                const { currentResultAPiHitCount, totalResultApiHitCount } = state;
                if (response.data.success) {
                    setState({
                        ...state,
                        filterReset: false,
                        products: response.data.products,
                        firstLoad: false,
                        complexionType: response.data.complexionType,
                        undertoneAPI: response.data.undertone,
                        photoIssue: false,
                    });
                } else if (
                    response.data.success === false &&
                    response.data.photoIssue === false &&
                    currentResultAPiHitCount <= totalResultApiHitCount &&
                    props.imageId
                ) {
                    setTimeout(() => {
                        setState({ ...state, currentResultAPiHitCount: currentResultAPiHitCount + 1 });
                        loadProducts();
                    }, 2500);
                } else {
                    let message = '';
                    let photoIssue = false;
                    if (props.imageId && currentResultAPiHitCount >= totalResultApiHitCount) {
                        message =
                            'Sorry, we could not complete your analysis at this time. Please try again with a different photo or try centering your face more in the center of the photo.';
                        photoIssue = true;
                    } else {
                        // eslint-disable-next-line prefer-destructuring
                        photoIssue = response.data.photoIssue;
                        // eslint-disable-next-line prefer-destructuring
                        message = response.data.message;
                    }
                    setState({
                        ...state,
                        firstLoad: false,
                        products: [],
                        photoIssue,
                        message,
                    });
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
                setState({
                    ...state,
                    products: [],
                });
            });
    }


    const handleOptionItemClick = (submenuId, optionId, selected) => {
        if (!selected) {

            let selectedFilters = {};

            if (Object.prototype.hasOwnProperty.call(state.selectedFilters, submenuId) && ['price', 'undertone'].indexOf(submenuId) === -1) {
                selectedFilters = {
                    ...state.selectedFilters,
                    [submenuId]: [...state.selectedFilters[submenuId], optionId],
                };
            } else {
                selectedFilters = {
                    ...state.selectedFilters,
                    [submenuId]: [optionId],
                };
            }

            setState({
                ...state,
                selectedFilters
            })
        } else {
            let selectedFilters = state.selectedFilters[submenuId].filter((item) => item !== optionId);
            selectedFilters = {
                ...state.selectedFilters,
                [submenuId]: selectedFilters,
            };
            setState({
                ...state,
                selectedFilters
            })
        }

        if (submenuId === 'price') {
            const prices = optionId.split('-');
            setState({
                ...state,
                minPrice: parseInt(typeof prices[0] !== 'undefined' && !selected ? prices[0] : minPrice, 10),
                maxPrice: parseInt(typeof prices[1] !== 'undefined' && !selected ? prices[1] : maxPrice, 10),
            });
        }
    };

    const handleSave = () => {
        setState({
            ...state,
            firstLoad: true,
            products: Array.from({ length: maxMockProducts }, () => ({})),
        });
        loadProducts();
        toggleFilterMenu();
    };

    /**
     * Reset filters if no results on "Clear Filter" action
     */
    const handleClearFilters = () => {
        setState({
            ...state,
            filterReset: true,
            firstLoad: true,
            products: Array.from({ length: maxMockProducts }, () => ({})),
            selectedFilters: {},
            minPrice: minPrice,
            maxPrice: maxPrice,
            complexionType: 'your',
            undertone: '',
        });
    };


    const toggleFilterMenu = () => {
        const { filterMenuVisible } = state;

        setState({
            ...state,
            filterMenuVisible: !filterMenuVisible,
        });
    };

    /**
     * Handle click on product heart icon
     */
    const handleItemLike = (item: Product) => {
        const { userId } = props;
        let method = 'like';

        if (item.isLiked) {
            method = 'unlike';
        }

        toggleItemLike(userId, item.id, method);
    };

    /**
     * Add/remove product from user's wishlist
     *
     * @param userId
     * @param productId
     * @param method
     */
    const toggleItemLike = (userId, productId, method) => {
        axios({
            method: 'post',
            url: `${process.env.ENDPOINT_URL + method}/`,
            headers: {
                Authorization: props.jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
            data: {
                signature: process.env.API_SIGNATURE,
                client_user: process.env.CLIENT_USER,
                userId,
                productId,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    const { products } = state;

                    // Find index of liked/unliked product
                    const updatedProductIndex = products.findIndex((product) => product.id === productId);

                    products[updatedProductIndex].isLiked = method === 'like';

                    setState({
                        ...state,
                        products,
                    });
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    };

    const renderLoadScreen = () => {
        const { progressItems } = props;

        return (
            <div className="ResultsPage-Loading">
                <h2>FINDING YOUR PERFECT MATCH...</h2>
                <img className="ResultsPage-Spinner" src={spinner} alt="Loading Results..." />
                <div className="ResultsPage-ProgressItems">
                    {progressItems.map((item, index) => {
                        const completeIn = index === progressItems.length - 1 ? undefined : PROGRESS_ITEM_DELAY * (index + 1);

                        return <ProgressItem completeIn={completeIn} text={item} key={item} />;
                    })}
                </div>
            </div>
        );
    }




    const { filterMenuVisible, selectedFilters, filters, products, firstLoad } = state;

    const topProducts = products.slice(0, 1);
    const alternativeProducts = products.slice(1);

    if (firstLoad) {
        return renderLoadScreen();
    }

    if (!products.length) {
        mixpanel.track('Viewed Results Page', { customer: process.env.CLIENT_USER, total_results: 0 });
        ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || '');
        ReactGA.event({
            category: 'User',
            action: 'Viewed Results Page',
        });

        return (
            <div className="ResultsPage">
                {/* <StepCounter stepLabel="Personalized Results" /> */}
                <Filter
                    requestPath={props.match.url}
                    filterState={filterMenuVisible}
                    toggleFilterMenu={toggleFilterMenu}
                    handleSave={handleSave}
                    handleOptionItemClick={handleOptionItemClick}
                    selectedFilters={selectedFilters}
                    filters={filters}
                    title=""
                    linkText="Filter"
                    products={topProducts.length}
                    handleClearFilters={handleClearFilters}
                    undertoneAPI={state.undertoneAPI}
                    message={state.message}
                    photoIssue={state.photoIssue}
                />
            </div>
        );
    }

    mixpanel.track('Viewed Results Page', { customer: process.env.CLIENT_USER, total_results: products.length });
    ReactGA.initialize('GTM-K7PDJWL');
    ReactGA.event({
        category: 'User',
        action: 'Viewed Results Page',
    });

    return (
        <div className="ResultsPage">
            <StepCounter stepLabel="Personalized Results" />
            <Filter
                requestPath={props.match.url}
                filterState={filterMenuVisible}
                toggleFilterMenu={toggleFilterMenu}
                handleSave={handleSave}
                handleOptionItemClick={handleOptionItemClick}
                selectedFilters={selectedFilters}
                filters={filters}
                title="Best Match for Your Complexion and Coverage"
                linkText="Filter"
                products={topProducts.length}
                handleClearFilters={handleClearFilters}
                undertoneAPI={state.undertoneAPI}
            />
            <ProductList products={topProducts} isFeatured firstLoad={firstLoad} handleItemLike={handleItemLike} />
            {/* topProducts[0].title === 'Camo CC Cream' ? <Coupon /> : '' */}
            {alternativeProducts.length ? (
                <section className="ResultsPage-Title">
                    <h2 className="ResultsPage-AlternativeTitle">Other Top Matches</h2>
                </section>
            ) : (
                ''
            )}
            <ProductList products={alternativeProducts} isFeatured={false} firstLoad={firstLoad} handleItemLike={handleItemLike} />
            <p>
                <i></i>
            </p>
        </div>
    );



}


const mapStateToProps = (state) => ({
    sku: state.app.sku,
    productId: state.app.productId,
    groupId: state.app.groupId,
    affId: state.app.affId,
    pbId: state.app.pbId,
    referrer: state.app.referrer,
    userId: state.app.userId,
    showBrand: state.app.showBrand,
    coverage: state.app.coverage,
    jwtToken: state.app.jwtToken,
    mimecid: state.app.mimecid,
    journeyId: state.app.journeyId,
    imageId: state.app.imageId,
    selfClassifiedComplexion: state.app.shadeCategory,
    primaryTone: state.app.primaryTone,
    undertoneChoice: state.app.undertoneChoice,
    acceptedBiometrics: state.app.acceptedBiometrics
});

const mapDispatchToProps = (dispatch) => ({
    selectBrand: (brand) => {
        dispatch(showBrand(brand));
    },
});

ResultsPage.propTypes = {
    sku: PropTypes.string,
    productId: PropTypes.string,
    groupId: PropTypes.string,
    affId: PropTypes.string,
    pbId: PropTypes.string,
    referrer: PropTypes.string,
    showBrand: PropTypes.string,
    coverage: PropTypes.array,
    userId: PropTypes.number,
    match: PropTypes.object,
    location: PropTypes.object,
    selectBrand: PropTypes.func,
    progressItems: PropTypes.arrayOf(PropTypes.string.isRequired),
    jwtToken: PropTypes.string,
    mimecid: PropTypes.string,
    imageId: PropTypes.number,
    primaryTone: PropTypes.array,
    acceptedBiometrics: PropTypes.bool
};

ResultsPage.defaultProps = {
    progressItems: ['Warming up', 'Analyzing your complexion', 'Finding your undertone', 'A little AI magic'],
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPage);
