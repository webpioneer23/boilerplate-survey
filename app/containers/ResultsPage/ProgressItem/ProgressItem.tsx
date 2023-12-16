import React, { PureComponent, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import checkSuccess from '../../../images/icons/check-success/check-success.png';
import checkSuccess2x from '../../../images/icons/check-success/check-success@2x.png';
import checkSuccess3x from '../../../images/icons/check-success/check-success@3x.png';
import checkGray from '../../../images/icons/check-gray/check-gray.png';
import checkGray2x from '../../../images/icons/check-gray/check-gray@2x.png';
import checkGray3x from '../../../images/icons/check-gray/check-gray@3x.png';
import './ProgressItem.scss';

const ProgressItem = ({ completeIn, text }: {
    completeIn: number | undefined
    text: string
}) => {

    const [isComplete, setIsComplete] = useState<boolean>(false);


    useEffect(() => {
        if (completeIn !== undefined) {
            const timer = setTimeout(() => {
                setIsComplete(true)
            }, completeIn);
            return () => clearInterval(timer);
        }
    }, [])

    if (isComplete) {
        return (
            <div className="ProgressItem">
                <img className="ProgressItem-Image" src={checkSuccess} srcSet={`${checkSuccess2x} 2x, ${checkSuccess3x} 3x`} alt="tick" />
                <span className="ProgressItem-Text">{text}</span>
            </div>
        );
    }

    return (
        <div className="ProgressItem">
            <img className="ProgressItem-Image" src={checkGray} srcSet={`${checkGray2x} 2x, ${checkGray3x} 3x`} alt="tick" />
            <span className="ProgressItem-Text">{text}</span>
        </div>
    );
}

ProgressItem.propTypes = PropTypes.shape({
    completeIn: PropTypes.number,
    text: PropTypes.string,
}).isRequired;

export default ProgressItem;