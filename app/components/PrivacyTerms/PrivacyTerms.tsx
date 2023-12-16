import React, { Component } from 'react';
import './PrivacyTerms.scss';

const PrivacyTerms: React.FC = () => {
    return (
        <section className="PrivacyTerms">
            <a
                href="https://www.elfcosmetics.com/privacy-policy/privacy-policy.html"
                className="Privacy"
                target="_blank"
            >
                Privacy Policy
            </a>
            <a
                href="https://www.elfcosmetics.com/terms-of-use/terms.html"
                className="Terms"
                target="_blank"
            >
                Terms and Conditions
            </a>
        </section>
    );
}

export default PrivacyTerms;
