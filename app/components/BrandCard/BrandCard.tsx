import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import './BrandCard.scss';
import iconBack from '../../images/icon-back.png';
import HomeBrand from '../../images/home-brand.png';
import HomeLogo from '../../images/home-logo.png';
import Footer from '../Footer';

type BrandCardProps = {
    backText?: string
    backLink?: string
    title: string
    mainContent: React.ReactNode
    actionSection: React.ReactNode
    isBrand?: boolean
    className?: string
    isFooter?: boolean
    progress?: boolean
}

function BrandCard({
    backText,
    backLink,
    title,
    mainContent,
    actionSection,
    isBrand = true,
    className = "",
    isFooter = false,
    progress = false
}: BrandCardProps) {

    return (
        <div className={'brand-card ' + className}>
            {backLink && (
                <div className='header'>
                    {backLink.includes('http') ? (
                        <a href={backLink} className='header-link'>
                            <img src={iconBack} height="16" />
                            <span className='ms-3'>{backText}</span>
                        </a>
                    ) : (
                        <Link to={backLink} className='header-link'>
                            <img src={iconBack} height="16" />
                            <span className='ms-3'>{backText}</span>
                        </Link>
                    )}
                </div>
            )}
            {isBrand && (
                <div className='home-brand'>
                    <img src={HomeBrand} style={{ width: '100%' }} />
                    <div className='home-logo'>
                        <img src={HomeLogo} width="100" />
                    </div>
                </div>
            )}
            {progress && (
                <div className='progress-bg'>
                    <div className='progress-bar' style={{ width: '85%' }}></div>
                </div>
            )}
            <div className="home-body">
                <p className={"title " + (!backLink ? 'mt-30' : '')}>
                    {title}
                </p>
                {mainContent}
            </div>
            <div className="action mt-30">
                {actionSection}
            </div>
            {isFooter && (
                <Footer />
            )}
        </div>
    );
}

// BrandCard.propTypes = {
//     accuracy: PropTypes.number,
// };

// BrandCard.defaultProps = {
//     accuracy: 0,
// };

export default BrandCard;
