import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button/Button';
import './Filter.scss';

type FilterPropType = {
    filterState: boolean,
    toggleFilterMenu: (val: string) => void,
    handleSave: () => void,
    handleOptionItemClick: (submenuId: number, optionId: number, selected: boolean) => void,
    handleClearFilters: () => void,
    selectedFilters: {
        coverage?: string[],
        undertone?: [],
        brands?: string[],
    },
    filters: {
        coverage?: string[],
        undertone?: [],
        brands?: string[],
        currencySymbol?: string
    },
    linkText: string,
    title: string,
    requestPath: string,
    products: number,
    undertoneAPI: string,
    photoIssue?: boolean,
    message?: string,
}

const Filter = (props: FilterPropType) => {

    const excludedFilters: string[] = process.env.EXCLUDED_FILTERS ? process.env.EXCLUDED_FILTERS.split(',') : [];

    /**
     * Render filter popup
     *
     * @returns {*}
     */
    const renderFilterMenu = () => {
        const { filters, filterState } = props;

        return (
            <div className={`Filter-Menu ${filterState ? 'Visible' : ''}`}>
                <div className="Filter-Menu-Wrapper">
                    <div className="Filter-Menu-Close">
                        <div
                            role="button"
                            tabIndex={0}
                            className="Filter-Menu-CloseButton"
                            onClick={props.handleSave}
                            onKeyPress={props.handleSave}
                        />
                        <div className="Filter-Menu-Title">Filters</div>
                    </div>
                    <div className="Filter-Submenu">
                        {Object.keys(filters).map((key) => {
                            if (excludedFilters.includes(key)) {
                                return false;
                            }
                            let filterKey = key;
                            if (filterKey === 'skinType') {
                                filterKey = 'skin type';
                            }

                            return renderFilterSubmenuItem(filters[key], filterKey);
                        })}
                    </div>
                    <Button onClick={props.handleSave} requestPath={props.requestPath}>
                        Save Filter
                    </Button>
                </div>
            </div>
        );
    }

    /**
     * Get filter option state - selected or not
     *
     * @param id
     * @param value
     * @returns {*}
     */
    const isSelected = (id, value) => {
        if (!Object.prototype.hasOwnProperty.call(props.selectedFilters, id)) {
            return false;
        }
        return props.selectedFilters[id].map((filter) => filter.toLowerCase()).includes(value.toLowerCase());
    }

    /**
     * Render filter options
     *
     * @param submenu
     * @param submenuId
     * @returns {*}
     */
    const renderFilterSubmenuItem = (submenu, submenuId) => {
        const { handleOptionItemClick } = props;
        return (
            <div className="Item" key={submenuId}>
                <div className="Item-Title">{submenuId}</div>
                <div className="Option-List">
                    {Object.keys(submenu).map((key) => {
                        const selected = isSelected(submenuId, submenu[key]);
                        return (
                            <div
                                role="button"
                                tabIndex={0}
                                className={`Option-Item ${selected ? 'Selected' : ''}`}
                                key={key}
                                onClick={() => handleOptionItemClick(submenuId, submenu[key].toLowerCase(), selected)}
                                onKeyPress={() => handleOptionItemClick(submenuId, submenu[key].toLowerCase(), selected)}
                            >
                                {submenuId === 'price' ? props.filters.currencySymbol : ''}
                                {submenu[key]}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    const renderPhotoIssue = () => (
        <>
            <p className="PhotoIssueTitle">YOUR RESULTS</p>
            <p className="PhotoIssueMessage">{props.message}</p>
            <div className="TRY-Another-PHOTO-BTN">
                <Button requestPath="/instructions">TRY ANOTHER PHOTO</Button>
            </div>
        </>
    );

    // eslint-disable-next-line no-unused-vars
    const { linkText, title, toggleFilterMenu } = props;
    const filterMessage = props.undertoneAPI
        ? `We don't have results for the filters you've chosen but we think you have a ${props.undertoneAPI} undertone.`
        : `We're sorry, we could not find a perfect match with that coverage.`;

    return (
        <section className="Filter-Wrapper">
            <div className="Filter-Heading">
                <span className="Filter-Title">{title}</span>
                {/* <span role="button" tabIndex={0} className="Filter-LinkText" onClick={toggleFilterMenu} onKeyPress={toggleFilterMenu}>
                        {linkText}
                    </span> */}
            </div>
            {renderFilterMenu()}
            {!props.products && !props.photoIssue ? (
                <div className="Products-Not-Found">
                    <p className="Notification">{filterMessage}</p>
                    <p className="Notification">
                        Click on the <u>Clear Filter</u> button to view all foundations and concealers.
                    </p>
                    <Button className="Filter-Save-Button Button" onClick={props.handleClearFilters} requestPath={props.requestPath}>
                        Clear Filter
                    </Button>
                </div>
            ) : (
                ''
            )}
            {props.photoIssue === true ? renderPhotoIssue() : ''}
        </section>
    );
}

export default Filter;
