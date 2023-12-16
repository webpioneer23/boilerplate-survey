import React, { Component, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import { setFoundation } from 'app/actions';
import axios, { AxiosRequestConfig } from 'axios';
import Dropdown from 'react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import Input from '../../components/Input/Input';
import InputLabel from '../../components/InputLabel/InputLabel';
import 'react-dropdown/style.css';
import '../../components/Dropdown/Dropdown.scss';
import './FoundationPage.scss';
import { FoundationProp, FoundationState } from './types';

interface MatchParams {
    name: string;
}

type Shade = {
    name: string
}


const FoundationPage: React.FC = () => {
    const appState = useSelector(state => state.app);
    const { foundationList, referrer } = appState;

    const dispatch = useDispatch();
    const setFoundation = (foundationList) => dispatch(setFoundation(foundationList));


    const maxFoundations = process.env.MAX_FOUNDATIONS;
    const method = 'foundations';

    const [state, setState] = useState<FoundationState>({
        selectedItems: foundationList,
        suggestions: [],
        productOptions: Array.from({ length: 3 }, () => []),
        shadeOptions: Array.from({ length: 3 }, () => []),
        brand: Array.from({ length: 3 }, () => ''),
        products: [],
    })

    useEffect(() => {
        loadSuggestions()
    }, [])

    const loadSuggestions = () => {
        const config = {
            url: `${process.env.ENDPOINT_URL + method}/`,
            headers: { 'Content-Type': 'application/json' },
            utm_referral_source: referrer,

        };
        axios(config)
            .then(response => {
                if (Object.hasOwnProperty.call(response.data, 'products')) {
                    setState({
                        ...state,
                        products: response.data.products,
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    const isFoundationRequired = (foundation) => {
        return Boolean(state.selectedItems.length === 1 || foundation.brandName || foundation.productName || foundation.shadeName);
    }

    const validateFoundation = (foundation) => {
        return Boolean(foundation.brandName && foundation.productName && foundation.shadeName);
    }

    const validateFoundationList = () => {
        return state.selectedItems.reduce((current, foundation) => {
            if (current && isFoundationRequired(foundation)) {
                return validateFoundation(foundation);
            }

            return current;
        }, true);
    }

    const nextStep = event => {
        if (event.target.hasAttribute('disabled')) {
            event.preventDefault();
            return;
        }

        const validFoundationList = state.selectedItems.filter(validateFoundation);
        setFoundation(validFoundationList);
    };

    const handleItemValueChange = (updateAt, key, value) => {
        const selectedItems = state.selectedItems.map((foundation, index) => {
            if (index !== updateAt) {
                return foundation;
            }

            const foundationCopy = { ...foundation };
            /**
             * Flag "other" option
             */
            if (value === 'Other') {
                foundationCopy[`${key}Other`] = true;
                foundationCopy[key] = '';
            } else {
                foundationCopy[key] = value;
                /**
                 * Set shades dropdown values if found
                 */
                if (key === 'productName') {
                    const options: string[] = [];
                    state.products.forEach(item => {
                        if (item.brand === state.brand[updateAt]) {
                            item.product.forEach(product => {
                                if (product.name === value) {
                                    product.shades.forEach((shade: { name: string }) => {
                                        options.push(shade.name);
                                    });
                                }
                            });
                        }
                    });

                    const newShareOptions = [...state.shadeOptions];
                    newShareOptions[index] = options;

                    setState({
                        ...state,
                        shadeOptions: newShareOptions
                    })
                }
            }
            return foundationCopy;
        });

        setState({
            ...state,
            selectedItems,
        });
    }

    /**
     * Handle add new item
     */
    const handleItemAddNew = () => {
        if (validateFoundationList()) {
            const { selectedItems } = state;
            setState({
                ...state,
                selectedItems: [
                    ...state.selectedItems,
                    {
                        brandName: '',
                        productName: '',
                        shadeName: '',
                    },
                ],
            })
        }
    }

    /**
     * Get suggestions by keyword
     *
     * @param value
     * @returns {*}
     */
    const getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const options = state.products.filter(product => product.brand.toLowerCase().slice(0, inputLength) === inputValue);

        return inputLength === 0 ? [] : options;
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setState({
            ...state,
            suggestions: getSuggestions(value),
        });
    };

    /**
     * @param suggestion
     * @returns {*}
     */
    const renderSuggestion = suggestion => <div>{suggestion.brand}</div>;

    /**
     * @param suggestion
     * @returns {string[] | string | *}
     */
    const getSuggestionValue = suggestion => suggestion.brand;

    /**
     * Set brand
     *
     * @param event
     * @param newValue
     * @param index
     */
    const onBrandChange = (event, { newValue }, index) => {
        const newBrand = [...state.brand];
        newBrand[index] = newValue;

        setState({
            ...state,
            brand: newBrand
        })

        const options = state.products.filter(product => product.brand.toLowerCase() === newValue.trim().toLowerCase());

        if (options.length) {
            const newOptions = [];
            for (const [key, item] of Object.entries(options[0].product)) {
                //@ts-ignore
                newOptions.push(item.name);
            }
            setState({
                ...state,
                productOptions: [...state.productOptions.slice(0, index), newOptions, ...state.productOptions.slice(index + 1, state.productOptions.length)]
            })
        } else {
            setState({
                ...state,
                productOptions: [...state.productOptions.slice(0, index), [], ...state.productOptions.slice(index + 1, state.productOptions.length)]
            })
        }

        new Promise(resolve => {
            resolve(handleItemValueChange(index, 'brandName', newValue));
        }).then(() => {
            new Promise(resolve => {
                resolve(handleItemValueChange(index, 'productNameOther', false));
            }).then(() => {
                handleItemValueChange(index, 'productName', '');
            });
        });
    };

    const handleProductChange = (index, value) => {
        new Promise(resolve => {
            resolve(handleItemValueChange(index, 'productName', value));
        }).then(() => {
            new Promise(resolve => {
                resolve(handleItemValueChange(index, 'shadeNameOther', false));
            }).then(() => {
                handleItemValueChange(index, 'shadeName', '');
            });
        });
    }

    const onSuggestionsClearRequested = () => {
        setState({
            ...state,
            suggestions: [],
        });
    };

    /**
     * Render auto-suggestions and conditional dropdown and text input fields
     *
     * @param item
     * @param index
     * @returns {*}
     */
    const renderItemBlock = (item, index) => {
        const { brand, suggestions, productOptions, shadeOptions } = state;
        const isRequired = isFoundationRequired(item);
        const inputProps = {
            placeholder: 'Choose your brand',
            value: item.brandName || brand[index],
            onChange: (e, value) => onBrandChange(e, value, index),
        };

        return (
            <section className={`Foundation-Item Foundation-Item-${index}`} key={`Foundation-Item-${index}`}>
                <form onSubmit={event => event.preventDefault()}>
                    <div className="Input-Wrapper">
                        <InputLabel label="Brand" required />
                        <Autosuggest
                            id={`Brand-${index}`}
                            suggestions={suggestions}
                            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                            getSuggestionValue={getSuggestionValue}
                            renderSuggestion={renderSuggestion}
                            onSuggestionsClearRequested={onSuggestionsClearRequested}
                            inputProps={inputProps}
                        />
                    </div>
                    {brand[index].length || item.brandName ? (
                        <div className="Input-Wrapper">
                            {!item.productNameOther && productOptions[index].length ? (
                                <div className="Input-Wrapper">
                                    <InputLabel label="Product" required />
                                    {/* @ts-ignore */}
                                    <Dropdown
                                        arrowClosed={<FontAwesomeIcon icon={faChevronDown} className="Dropdown-Arrow Dropdown-Arrow-Closed" />}
                                        arrowOpen={<FontAwesomeIcon icon={faChevronDown} className="Dropdown-Arrow Dropdown-Arrow-Open" />}
                                        options={productOptions[index] || []}
                                        value={item.productName}
                                        className="Dropdown"
                                        controlClassName="Dropdown-Input"
                                        placeholder="Select your product"
                                        onChange={e => handleProductChange(index, e.value)}
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                            {item.productNameOther || !productOptions[index].length ? (
                                <Input
                                    ref={`productName${index}`}
                                    label="Product"
                                    handleInputChange={e => handleItemValueChange(index, 'productName', e.currentTarget.value)}
                                    placeholder="Add your product"
                                    value={item.productName}
                                    required={isRequired}
                                />
                            ) : (
                                ''
                            )}
                            {!item.shadeNameOther && item.productName.length && shadeOptions[index].length ? (
                                <div className="Input-Wrapper">
                                    <InputLabel label="Shade" required />
                                    <Dropdown
                                        arrowClosed={<FontAwesomeIcon icon={faChevronDown} className="Dropdown-Arrow Dropdown-Arrow-Closed" />}
                                        arrowOpen={<FontAwesomeIcon icon={faChevronDown} className="Dropdown-Arrow Dropdown-Arrow-Open" />}
                                        options={Array.isArray(shadeOptions[index]) ? shadeOptions[index] : []}
                                        value={item.shadeName}
                                        className="Dropdown"
                                        controlClassName="Dropdown-Input"
                                        placeholder="Select your shade"
                                        onChange={e => handleItemValueChange(index, 'shadeName', e.value)}
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                            {item.shadeNameOther || (item.productName.length && !shadeOptions[index].length) ? (
                                <Input
                                    label="Shade"
                                    handleInputChange={e => handleItemValueChange(index, 'shadeName', e.currentTarget.value)}
                                    placeholder="Add your shade"
                                    value={item.shadeName}
                                    required={isRequired}
                                />
                            ) : (
                                ''
                            )}
                        </div>
                    ) : (
                        ''
                    )}
                </form>
            </section>
        );
    }


    return (
        <div className="FoundationPage">
            <StepCounter step={2} />
            <StepTitle title="Tell us which foundation you’re currently using" />

            {state.selectedItems.map((item, index) => renderItemBlock(item, index))}

            <section className="Foundation-AddNew-Wrapper">
                {maxFoundations && state.selectedItems.length < parseInt(maxFoundations) ? (
                    <div
                        tabIndex={0}
                        role="button"
                        className="Foundation-AddNew"
                        onClick={() => handleItemAddNew()}
                        onKeyPress={() => handleItemAddNew()}
                    >
                        + add another foundation
                    </div>
                ) : null}
            </section>
            <Button disabled={!validateFoundationList()} onClick={nextStep} requestPath="/step-three">
                Next
            </Button>
        </div>
    );
}

export default FoundationPage;
