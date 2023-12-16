import React from 'react';
import PropTypes from 'prop-types';

type PhotoItem = {
    status: string,
    imageURL: string
}

function ImagePreview({ photoURLs, index, onImageRemove, onImageRetry }:
    {
        photoURLs: Array<PhotoItem>,
        index: number,
        onImageRemove: (val: PhotoItem) => void,
        onImageRetry: (val: PhotoItem) => void
    }) {
    const hasImage = typeof photoURLs[index] !== 'undefined';

    if (!hasImage) {
        return (
            <div className="ImagePreview">
                <div>
                    <span />
                </div>
            </div>
        );
    }

    let button: React.ReactNode = '';

    if (photoURLs[index].status === 'success') {
        button = (
            <button
                className="ImageUpload-RemoveButton"
                type="button"
                onClick={() => onImageRemove(photoURLs[index])}
            >
                Remove
            </button>
        );
    } else if (photoURLs[index].status === 'fail') {
        button = (
            <button
                className="ImageUpload-RemoveButton"
                type="button"
                onClick={() => onImageRetry(photoURLs[index])}
            >
                Retry?
            </button>
        );
    }

    return (
        <div className="ImagePreview">
            <div className={`ImagePreview-Image__${photoURLs[index].status}`}>
                <img alt="face" src={photoURLs[index].imageURL} />
            </div>
            {button}
        </div>
    );
}

ImagePreview.propTypes = {
    onImageRetry: PropTypes.func,
    onImageRemove: PropTypes.func,
    photoURLs: PropTypes.array,
    index: PropTypes.number,
};

export default ImagePreview;
