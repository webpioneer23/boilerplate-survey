import React from 'react';
import PropTypes from 'prop-types';
import checkIcon from '../../images/icons/check-circle/check-circle.png';
import checkIcon2x from '../../images/icons/check-circle/check-circle@2x.png';
import checkIcon3x from '../../images/icons/check-circle/check-circle@3x.png';

function SurveyAnswer(props: {
    leftImageUrl: string, rightImageUrl: string, index: number, isSelected: boolean, onSelect: () => void
}) {
    const { leftImageUrl, rightImageUrl, index, isSelected, onSelect } = props;

    return (
        <div
            role="button"
            tabIndex={index}
            className={`Survey-Item ${isSelected ? 'Selected' : ''}`}
            onClick={() => onSelect()}
            onKeyPress={() => onSelect()}
        >
            <div className="Survey-Item-Shade">
                <div className="Survey-Item-Element" style={{ backgroundImage: `url(${leftImageUrl}), url(${rightImageUrl})` }}>
                    <div className="Survey-Item-Element-Gradient-Background">
                        <div className="Survey-Item-Element-Tick-Container">
                            <img src={checkIcon} srcSet={`${checkIcon2x} 2x, ${checkIcon3x} 3x`} alt="Check" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

SurveyAnswer.propTypes = {
    leftImageUrl: PropTypes.string,
    rightImageUrl: PropTypes.string,
    index: PropTypes.number,
    isSelected: PropTypes.bool,
    onSelect: PropTypes.func,
};

export default SurveyAnswer;
