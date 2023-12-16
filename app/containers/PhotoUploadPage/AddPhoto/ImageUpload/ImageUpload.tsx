import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { uploadPhoto, removePhoto, setAcceptedBiometrics } from 'app/actions';
import ImagePreview from 'components/ImagePreview';
import MobileOnly from 'containers/MobileOnly';
import DesktopOnly from 'containers/DesktopOnly';
import PhotoConfirmModal from '../../PhotoConfirmModal';


function ImageUpload({ photoURLs, onImageUpload, onImageRemove, photoUploadError, onAcceptBio }) {

    const requiredImageCount = useMemo(() => parseInt(process.env.MIN_IMAGE_COUNT || '', 10), []);
    const isPhotoUploadDisabled = photoURLs.filter(photo => photo.status === 'success').length >= requiredImageCount;
    const photosLeftCount = requiredImageCount - photoURLs.filter(photo => photo.status !== 'fail').length;

    const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);

    useEffect(() => {
        if (photoURLs.length > 0) {
            if (photoURLs[0].status === "success") {
                setIsConfirmModal(true);
            }
        }
    }, [photoURLs])

    const submitAccept = (val: boolean) => {
        onAcceptBio(val)
        setIsConfirmModal(false)
    }


    return (
        <div className="ImageUpload">
            <div className="ImageUpload-PreviewContainer">
                {Array.from(Array(requiredImageCount).keys()).map(key => (
                    <ImagePreview
                        photoURLs={photoURLs}
                        index={key}
                        onImageRemove={onImageRemove}
                        onImageRetry={photoURL => {
                            // eslint-disable-next-line no-param-reassign
                            photoURL.status = 'pending';

                            onImageUpload(photoURL);
                        }}
                        key={`image-preview-${key}`}
                    />
                ))}
            </div>
            <div className="ImageUpload-ImageIssue">
                {photoUploadError ? (
                    <>
                        <h4>Photo Issue</h4>
                        <p>Tip: {photoUploadError}</p>
                    </>
                ) : (
                    ''
                )}
            </div>
            <input
                id="ImageUploadInput"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                disabled={isPhotoUploadDisabled}
                onChange={event => {
                    // eslint-disable-next-line no-plusplus
                    const files: FileList | null = event.target.files;
                    if (files) {
                        for (let i = 0; i < Math.min(files?.length, photosLeftCount); i++) {
                            const image = files[i];
                            const reader = new FileReader();
                            reader.onload = loadEvent => {
                                onImageUpload({
                                    id: Date.now(),
                                    imageURL: loadEvent.target?.result,
                                    status: 'pending',
                                });
                            };
                            reader.readAsDataURL(image);
                        }
                        // eslint-disable-next-line no-param-reassign
                        event.target.value = '';
                    }

                }}
            />
            <label htmlFor="ImageUploadInput" className={`chooseFileButton ${isPhotoUploadDisabled ? 'chooseFileButton__disabled' : ''}`}>
                <DesktopOnly><>Upload a Photo</></DesktopOnly>
                <MobileOnly><>Take a Photo</></MobileOnly>
            </label>
            <PhotoConfirmModal isConfirmModal={isConfirmModal} onclose={() => setIsConfirmModal(false)} submitAccept={submitAccept} />
        </div>
    );
}

ImageUpload.propTypes = {
    onImageUpload: PropTypes.func,
    onImageRemove: PropTypes.func,
    photoURLs: PropTypes.array,
    photoUploadError: PropTypes.string,
};

const mapStateToProps = state => ({
    photoURLs: state.app.photoURLs,
    photoUploadError: state.app.photoUploadError,
});

const mapDispatchToProps = dispatch => ({
    onImageUpload: photoURL => dispatch(uploadPhoto(photoURL)),
    onImageRemove: photoURL => dispatch(removePhoto(photoURL)),
    onAcceptBio: acceptBio => dispatch(setAcceptedBiometrics(acceptBio)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ImageUpload);
