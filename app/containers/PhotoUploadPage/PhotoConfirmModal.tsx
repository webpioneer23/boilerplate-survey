import React from 'react';
import BrandCard from 'components/BrandCard/BrandCard';
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import CircleBack from '../../images/circle-back.png'


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '500px',
        padding: '0px'
    },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#app');

function PhotoConfirmModal({ isConfirmModal, onclose, submitAccept }) {

    const mainContent = (
        <div className="home-content">
            <p>YOUR PRIVACY IS IMPORTANT TO US, SO HERE IS HOW WE WILL USE YOUR PHOTO:</p>
            <p className='mt-30 text-bold'>FIND A FACE</p>
            <p>
                WE’LL USE FACIAL DETECTION TO FIND A FACE IN THE PHOTO
            </p>
            <p className='mt-30 text-bold'>DETERMINE FACE SHAPE</p>
            <p>
                WE’LL USE BIOMETRICS TO IDENTIFY YOUR FACE SHAPE
            </p>

            <p className='mt-30 text-bold'>PREDICT SKIN TONE</p>
            <p>
                WE’LL USE AI & MACHINE LEARNING TO ANALYZE LIGHT AND UNIQUE COLORS ON YOUR FACE
            </p>

            <p className='mt-30'>
                YOU CAN DELETE YOUR DATA AT ANY TIME. YOUR PHOTO IS NEVER SHARED OR SOLD.
            </p>
        </div>
    )

    const actionSection = (
        <>
            <div>
                <button className='btn btn-primary' onClick={() => submitAccept(true)}>YES, I AGREE</button>
                <button className="btn btn-secondary mt-2" onClick={() => submitAccept(false)}>NO THANKS</button>
            </div>
            <p className='text-grey mt-30 px-70'>
                IF YOU WISH TO SKIP THE PHOTO UPLOAD WE WILL STILL HELP YOU FIND RECOMMENDED PRODUCTS.
            </p>
            <a href="#" className='btn-link d-flex mt-30 justify-center'>
                <img src={CircleBack} width="15" />
                <span className='ms-2 text-bold'>Start again</span>
            </a>
        </>
    )

    return (
        <Modal
            isOpen={isConfirmModal}
            onRequestClose={onclose}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <BrandCard
                title="DO WE HAVE YOUR PERMISSSION TO FIND YOUR PERFECT MATCH?"
                mainContent={mainContent}
                actionSection={actionSection}
                isBrand={false}
                isFooter={true}
                progress={true}
            />
        </Modal>
    );
}


export default PhotoConfirmModal;