import BrandCard from 'components/BrandCard/BrandCard';
import { Link } from 'react-router-dom'
import React from 'react';


const LegalPage = () => {

    const mainContent = (
        <div className="home-content">
            <p>For Charlotte Tilbury Beauty Limited:</p>
            <p className='mt-30'>
                <a href="#" target="_blank" className='btn-link'>Terms & Conditions,</a>
                <a href="#" target="_blank" className='btn-link'>Privacy Policy,</a>
                <a href="#" target="_blank" className='btn-link'>Cookies Policy,</a>
                <a href="#" target="_blank" className='btn-link'>Do Not Sell My Personal Information</a>
            </p>
            <p className='mt-30'>
                For MIME:
            </p>
            <p className='mt-30'>
                <a href="#" target="_blank" className='btn-link'>Terms & Conditions,</a>
                <a href="#" target="_blank" className='btn-link'>Privacy Policy,</a>
                <a href="#" target="_blank" className='btn-link'>Data Usage Policy,</a>
                <a href="#" target="_blank" className='btn-link'>Cookies Policy,</a>
                <a href="#" target="_blank" className='btn-link'>Do Not Sell My Personal Information</a>
            </p>
            <p className='mt-30'>
                Each link will open in a new window.
            </p>
        </div>
    )

    const actionSection = (
        <Link to='/' className='btn btn-primary'>BACK TO HOME</Link>
    )


    return (
        <div className='legal-page'>
            <BrandCard title="LEGAL TERMS" backText="Back" backLink="/" mainContent={mainContent} actionSection={actionSection} />
        </div>
    )
}

export default LegalPage;