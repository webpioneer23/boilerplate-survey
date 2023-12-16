import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import countryListWithPhone from 'utils/countryWithNumberProvider';
import './index.scss';
import { CountryType } from 'types';

const defaultCountry = {
    name: 'United States',
    iso2: 'gb',
    dialCode: '1',
    priority: 0,
    areaCodes: null,
    language: 'en',
    sample: '07700 900123',
};

function InputCountrySelect(props: { type: string, handleInputChange: (val: string) => void }) {
    const { type, handleInputChange } = props;
    useEffect(() => {
        const countrySelect = document.getElementById('CountrySelect') as HTMLElement;
        const countryList = document.getElementById('CountryList') as HTMLElement;

        window.addEventListener('click', (event: MouseEvent): void => {
            if (countrySelect?.contains(event.target as Node)) {
                countryList.classList.remove('hidden');
            } else {
                countryList.classList.add('hidden');
            }
        });
    }, []);
    const [selectedCountry, setCountry] = useState<CountryType>(defaultCountry);
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    return (
        <div className="InputCountrySelect-Wrapper linkTextingWidget">
            <input
                type={type}
                placeholder={selectedCountry.sample || ''}
                className="InputCountrySelect-Field"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const country = selectedCountry.iso2.toUpperCase();
                    //@ts-ignore
                    setPhoneNumber(new AsYouType(selectedCountry.iso2.toUpperCase()).input(event.target.value));
                    //@ts-ignore
                    const parsedPhone = parsePhoneNumberFromString(event.target.value, country);
                    if (parsedPhone) {
                        handleInputChange(parsedPhone.number.replace('+', ''));
                    }
                }}
                value={phoneNumber}
            />
            <div className="InputCountrySelect-FlagDropdown" id="CountrySelect">
                <div className="InputCountrySelect-SelectedFlag">
                    <div className={`iti-flag ${selectedCountry.iso2}`} />
                    <div className="arrow" />
                </div>
            </div>
            <ul id="CountryList" className="InputCountrySelect-CountryList hidden">
                {countryListWithPhone.map((country) => (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                    <li role="menuitem" className="InputCountrySelect-Country" key={country.iso2} onClick={() => setCountry(country)}>
                        <div className="InputCountrySelect-Flag">
                            <div className={`iti-flag ${country.iso2}`} />
                        </div>
                        <span className="InputCountrySelect-CountryName">{country.name}</span>
                        <span className="InputCountrySelect-DialCode">+{country.dialCode}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

InputCountrySelect.propTypes = {
    type: PropTypes.string,
    handleInputChange: PropTypes.func.isRequired,
};

InputCountrySelect.defaultProps = {
    type: 'text',
};

export default InputCountrySelect;
