import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { put, all, takeEvery, select } from 'redux-saga/effects';
import {
    UPLOAD_PHOTO, REMOVE_PHOTO, SET_SKIN_TWIN_STEP, uploadPhoto, emitPhotoUploadError, updateSkinStepData, setImageId,
    setIsAuthenticated,
    setJWTToken,
    setJWTRefreshToken
} from 'app/actions';
import isMobile from 'ismobilejs';
import crypto from 'crypto';
import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';

const requestSkinTwin = (complexion: string, userId: string, primaryTone: string, secondaryTone: string, undertoneChoice?: string) => {
    const config: AxiosRequestConfig = {
        method: 'post',
        url: `${process.env.ENDPOINT_URL}getSkinTwin/?complexion=${complexion}`,
        headers: { 'Content-Type': 'application/json' },
        data: {
            signature: process.env.API_SIGNATURE,
            client_user: process.env.CLIENT_USER,
            leadSource: process.env.LEAD_SOURCE,
            deviceType: isMobile().apple.device ? 'iOS' : 'Android',
            userId,
            primaryTone,
            secondaryTone,
            undertoneChoice,
        },
    }
    return axios(config)
        .then((response: AxiosResponse) => {
            /**
             * On success has no 'success' property
             */
            const responseSuccess = Object.hasOwnProperty.call(response.data, 'steps');
            if (responseSuccess) {
                const [stepData] = response.data.steps;
                return {
                    status: 'success',
                    message: '',
                    stepData,
                };
            }

            return {
                status: 'fail',
                message: response.data.message,
            };
        })
        .catch((error) => ({
            status: 'fail',
            message: error.toString(),
        }));
}

const getRefreshToken = (appState) => {
    axios({
        method: 'post',
        url: `${process.env.ENDPOINT_URL}refresh`,
        headers: {
            Authorization: appState.jwtToken,
            'Access-Control-Allow-Headers': 'sentry-trace, baggage',
        },
        data: {
            jwtRefreshToken: appState.jwtRefreshToken,
            retailerId: process.env.RETAILER_ID,
        },
    })
        .then((response) => {

            if (response.data.jwtAccessToken) {

                setIsAuthenticated(true);

                setJWTToken(response.data.jwtAccessToken);

                setJWTRefreshToken(response.data.jwtRefreshToken);
            }
        })
        .catch((error) => {

            // eslint-disable-next-line no-console
            console.log(error)

        });
}


const apiImageUpload = (imageURL, exif, appState) =>
    axios({
        method: 'post',
        url: `${process.env.ENDPOINT_URL}image`,
        headers: {
            'Content-Type': 'application/json',
            Authorization: appState.jwtToken,
            'Access-Control-Allow-Headers': 'sentry-trace, baggage'
        },
        data: {
            signature: process.env.API_SIGNATURE,
            client_user: process.env.CLIENT_USER,
            mimecid: appState.mimecid,
            imageUrl: imageURL,
            deviceInformation: exif,
            deviceType: isMobile().apple.device ? 'iOS' : 'Android',
            deviceUserAgent: window.navigator.userAgent,
        },
    })
        .then((response) => {

            const responseSuccess = response.data.success;
            if (responseSuccess) {
                return {
                    status: 'success',
                    message: '',
                    imageURL: response.data.imageUrl,
                    imageId: response.data.imageId,
                };
            }

            return {
                status: 'fail',
                message: response.data.message,
            };
        })
        .catch((error) => {
            if (error?.response?.status === 401) {
                return ({
                    status: 'auth_error',
                    message: error.toString(),
                })
            }
            return ({
                status: 'fail',
                message: error.toString(),
            })
        });

function cloudinaryUploadFile(file) {
    const timestamp = Date.now();
    const signature = crypto
        .createHash('sha256')
        .update(`eager=${process.env.CLOUDINARY_TRANSFORM}&eager_async=true&exif=true&timestamp=${timestamp}${process.env.CLOUDINARY_SECRET}`)
        .digest('hex');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eager_async', 'true');
    formData.append('exif', 'true');
    formData.append('eager', process.env.CLOUDINARY_TRANSFORM || '');
    formData.append('api_key', process.env.CLOUDINARY_KEY || '');
    formData.append('timestamp', timestamp + '');
    formData.append('signature', signature);
    formData.append('client_user', process.env.CLIENT_USER || '');
    const config: AxiosRequestConfig = {
        method: 'post',
        url: `${process.env.CLOUDINARY_URL}${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
        headers: { 'Content-Type': 'application/json' },
        data: formData,
    }

    return axios(config)
        .then((response: AxiosResponse) => {
            if (response.data.public_id) {
                let imageURL = response.data.secure_url;
                if (Object.hasOwnProperty.call(response.data, 'eager')) {
                    imageURL = response.data.eager[0].secure_url;
                }
                let exif = response.data.exif || [];
                return {
                    status: 'success',
                    message: '',
                    imageURL,
                    exif,
                };
            }
            return {
                status: 'fail',
                message: '',
            };
        })
        .catch((error) => ({
            status: 'fail',
            message: error.toString(),
        }));
}

function* onImageUpload(action) {
    if (action.photoURL.status !== 'pending') {
        return;
    }

    const appState = yield select((state) => state.app);

    try {
        let { imageURL } = action.photoURL;

        const cloudinaryResponse = yield cloudinaryUploadFile(imageURL);
        let status = 'fail';
        let uploadError = '';
        let imageId = null;
        let exif = [];

        if (cloudinaryResponse.status === 'success') {

            uploadError = cloudinaryResponse.message;

            exif = cloudinaryResponse.exif;

            const serverResponse = yield apiImageUpload(cloudinaryResponse.imageURL, exif, appState);

            uploadError = serverResponse.message;

            if (serverResponse.status === 'success') {
                mixpanel.init(process.env.MIXPANEL_TOKEN);
                mixpanel.track('Uploaded Photo Successfully', { customer: process.env.CLIENT_USER });

                ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || '');
                ReactGA.event({
                    category: 'User',
                    action: 'Uploaded Photo Successfully',
                });

                status = 'success';
                // eslint-disable-next-line prefer-destructuring
                imageURL = cloudinaryResponse.imageURL;
                // eslint-disable-next-line prefer-destructuring
                imageId = serverResponse.imageId;
            }
            if(serverResponse.status === 'auth_error'){
                yield getRefreshToken(appState);
            }
        }

        yield all([put(uploadPhoto({ id: action.photoURL.id, status, imageURL })), put(setImageId(imageId))]);

        if (status !== 'success') {
            yield put(emitPhotoUploadError(uploadError));
        }

    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}

function* onSkinTwinStep(action) {
    try {
        const { complexion, userId, primaryTone, secondaryTone } = action;

        const apiResponse = yield requestSkinTwin(complexion, userId, primaryTone, secondaryTone);
        const { status } = apiResponse;

        if (status === 'success') {
            const { stepData } = apiResponse;

            yield put(updateSkinStepData(stepData));
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }
}

function* onImageRemove(action) {
    const appState = yield select((state) => state.app);
    yield put(setImageId(null));
    axios({
        method: 'delete',
        url: `${process.env.ENDPOINT_URL}image`,
        headers: { 'Content-Type': 'application/json', Authorization: appState.jwtToken, 'Access-Control-Allow-Headers': 'sentry-trace, baggage', },
        data: {
            signature: process.env.API_SIGNATURE,
            client_user: process.env.CLIENT_USER,
            imageUrl: action.photoURL.imageURL,
        },
    });
}

function* appSaga() {
    yield takeEvery(UPLOAD_PHOTO, onImageUpload);
    yield takeEvery(REMOVE_PHOTO, onImageRemove);
    yield takeEvery(SET_SKIN_TWIN_STEP, onSkinTwinStep);
}

export default appSaga;
