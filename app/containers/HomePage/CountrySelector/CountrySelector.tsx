import React from 'react';
import PropTypes from 'prop-types';
import Dropdown, { Option } from 'react-dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import InputLabel from '../../../components/InputLabel/InputLabel';
import 'react-dropdown/style.css';
import '../../../components/Dropdown/Dropdown.scss';
import './CountrySelector.scss';

const CountrySelector = ({ country, selectCountry, countries }: {
    country: string
    selectCountry: (val: string) => void
    countries: string[]
}) => {

    return (
        <section className="CountrySelector">
            <div className="CountrySelector-Inner">
                <h2>Create a free account to begin</h2>
                <InputLabel label="Country" required />
                <Dropdown
                    arrowClosed={<FontAwesomeIcon icon={faChevronDown} className="Dropdown-Arrow Dropdown-Arrow-Closed" />}
                    arrowOpen={<FontAwesomeIcon icon={faChevronDown} className="Dropdown-Arrow Dropdown-Arrow-Open" />}
                    className="Dropdown"
                    controlClassName="Dropdown-Input"
                    options={countries}
                    value={country}
                    placeholder="Select your country"
                    onChange={(event: Option) => selectCountry(event.value)}
                />
            </div>
        </section>
    );
}

CountrySelector.propTypes = {
    selectCountry: PropTypes.func,
    country: PropTypes.string,
    countries: PropTypes.array,
};

export default CountrySelector;
