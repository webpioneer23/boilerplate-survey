import React from 'react';
import header from '../../../images/background/foundation-shade-finder-header.png';
import header2x from '../../../images/background/foundation-shade-finder-header@2x.png';
import header3x from '../../../images/background/foundation-shade-finder-header@3x.png';
import './HeroBlock.scss';

const HeroBlock = () => {
    return (
        <section className="HeroBlock">
            <div className="HeroBlock-Inner">
                <img className="HeroBlock-Inner-Logo" src={header} srcSet={`${header2x} 2x, ${header3x} 3x`} alt="Foundation shade finder" />
            </div>
        </section>
    );
}

export default HeroBlock;
