/* eslint-disable no-case-declarations */
/* eslint-disable indent */
import {
    SHOW_BRAND,
    SELECT_COUNTRY,
    UPLOAD_PHOTO,
    REMOVE_PHOTO,
    SET_FOUNDATION,
    SELECT_SKIN_TONE,
    SET_USER_ID,
    RESET_USER_DATA,
    TOGGLE_UNDERTONE,
    SET_USER_EMAIL,
    SET_USER_FIRSTNAME,
    SET_QUERY_PARAMS,
    SET_USER_IP_ADDRESS,
    SET_USER_COMMUNICATION,
    SET_USER_COVERAGE,
    SET_USER_SHADE_CATEGORY,
    SET_USER_PRIMARY_TONE,
    SET_USER_SECONDARY_TONE,
    SET_USER_SURVEY_STEPS,
    SET_USER_SURVEY_STEP,
    SET_USER_SURVEY_ANSWERS,
    EMIT_PHOTO_UPLOAD_ERROR,
    SET_REFERRER,
    SET_DOMAIN,
    SET_LOCALE,
    SET_SKIN_TWIN_STEP_DATA,
    SET_SELF_CLASSIFICATION,
    SET_UNDERTONE_CHOICE,
    SET_SKU,
    SET_PRODUCT_ID,
    SET_GROUP_ID,
    SET_AFF_ID,
    SET_PB_ID,
    SET_MIMECID,
    SET_JWT_TOKEN,
    SET_IS_AUTHENTICATED,
    SET_JOURNEY_ID,
    SET_IMAGE_ID,
    SET_JWT_REFRESH_TOKEN,
    SET_COUNTRY_CODE,
    SET_ACCEPTED_BIOMETRICS,
} from './actions';
import { ContainerActions, ContainerState } from './types';
import { AnyAction } from 'redux'

const initialState = {
    email: '',
    showBrand: '',
    country: '',
    photoURLs: [],
    foundationList: [
        {
            brandName: '',
            productName: '',
            shadeName: '',
        },
    ],
    preferredSkinTone: '',
    userId: null,
    firstName: '',
    ipAddress: '',
    communication: false,
    undertone: null,
    coverage: [],
    photoUploadError: '',
    shadeCategory: '',
    selfClassification: '',
    primaryTone: [],
    secondaryTone: [],
    undertoneChoice: [],
    surveyStepsCount: 0,
    skinTwinStepData: {},
    isAuthenticated: false,
    jwtToken: null,
    jwtRefreshToken: null,
    mimecid: null,
    queryParams: {},
    journeyId: null,
    imageId: null,

    acceptedBiometrics: false
};

type Photo = {
    id?: number | string
    status?: string
    imageURL?: string
}

const appReducer = (state: ContainerState = initialState, action: AnyAction) => {
    switch (action.type) {
        case SET_ACCEPTED_BIOMETRICS:
            return {
                ...state,
                acceptedBiometrics: action.acceptBio,
            };
        case SHOW_BRAND:
            return {
                ...state,
                showBrand: action.brand,
            };
        case SELECT_COUNTRY:
            return {
                ...state,
                country: action.country,
            };
        case UPLOAD_PHOTO:
            let { photoURLs } = state;
            let newPhotoUrls: Photo[] = []
            const idList = state.photoURLs.map((photo: Photo) => photo.id);
            if (idList.indexOf(action.photoURL.id) !== -1) {
                const index = idList.indexOf(action.photoURL.id);
                newPhotoUrls = [...photoURLs.slice(0, index), action.photoURL, ...photoURLs.slice(index + 1)];
            } else if (state.photoURLs.filter((photo: Photo) => photo.status === 'fail').length) {
                const index = state.photoURLs.map((photo: Photo) => photo.status).indexOf('fail');
                newPhotoUrls = [...photoURLs.slice(0, index), action.photoURL, ...photoURLs.slice(index + 1)];
            } else {
                newPhotoUrls = photoURLs.concat([action.photoURL]);
            }

            const hasAnyError = newPhotoUrls.map((photo) => photo.status).filter((status) => status !== 'success');

            let { photoUploadError } = state;
            if (!hasAnyError.length) {
                photoUploadError = '';
            }

            return {
                ...state,
                photoURLs: newPhotoUrls,
                photoUploadError,
            };
        case REMOVE_PHOTO: {
            const newPhotoURLs = state.photoURLs.filter((item) => item.id !== action.photoURL.id);
            return {
                ...state,
                photoURLs: newPhotoURLs,
            };
        }
        case SET_FOUNDATION:
            return {
                ...state,
                foundationList: action.foundationList,
            };
        case SELECT_SKIN_TONE:
            return {
                ...state,
                preferredSkinTone: action.skinTone,
            };
        case SET_USER_ID:
            return {
                ...state,
                userId: action.userId,
            };
        case RESET_USER_DATA:
            //return initialState;
            return {
                ...state,
                undertoneChoice: [],
                coverage: [],
                shadeCategory: '',
                primaryTone: [],
                surveyAnswers: null,
                selfClassification: null,
                imageId: null,
            };
        case TOGGLE_UNDERTONE:
            return {
                ...state,
                undertone: action.undertone,
            };
        case SET_UNDERTONE_CHOICE:
            return {
                ...state,
                undertoneChoice: action.undertoneChoice,
            };
        case SET_USER_EMAIL:
            return {
                ...state,
                email: action.email,
            };
        case SET_USER_FIRSTNAME:
            return {
                ...state,
                firstName: action.firstName,
            };
        case SET_QUERY_PARAMS:
            return {
                ...state,
                queryParams: action.queryParams,
            };
        case SET_USER_IP_ADDRESS:
            return {
                ...state,
                ipAddress: action.ipAddress,
            };
        case SET_USER_COMMUNICATION:
            return {
                ...state,
                communication: action.communication,
            };
        case SET_USER_COVERAGE:
            return {
                ...state,
                coverage: action.coverage,
            };
        case SET_USER_SHADE_CATEGORY:
            return {
                ...state,
                shadeCategory: action.shadeCategory,
            };
        case SET_USER_PRIMARY_TONE:
            return {
                ...state,
                primaryTone: action.primaryTone,
            };
        case SET_USER_SECONDARY_TONE:
            return {
                ...state,
                secondaryTone: action.secondaryTone,
            };
        case SET_USER_SURVEY_STEPS:
            return {
                ...state,
                surveyStepsCount: action.surveySteps,
            };
        case SET_USER_SURVEY_STEP:
            return {
                ...state,
                surveyStep: action.surveyStep,
            };
        case SET_USER_SURVEY_ANSWERS:
            return {
                ...state,
                surveyAnswers: action.surveyAnswers,
            };
        case SET_SKU:
            return {
                ...state,
                sku: action.sku,
            };
        case SET_PRODUCT_ID:
            return {
                ...state,
                productId: action.productId,
            };
        case SET_GROUP_ID:
            return {
                ...state,
                groupId: action.groupId,
            };
        case SET_AFF_ID:
            return {
                ...state,
                affId: action.affId,
            };
        case SET_PB_ID:
            return {
                ...state,
                pbId: action.pbId,
            };
        case SET_REFERRER:
            return {
                ...state,
                referrer: action.referrer,
            };
        case SET_DOMAIN:
            return {
                ...state,
                domain: action.domain,
            };
        case SET_LOCALE:
            return {
                ...state,
                locale: action.locale,
            };
        case EMIT_PHOTO_UPLOAD_ERROR:
            return {
                ...state,
                photoUploadError: action.error,
            };
        case SET_SKIN_TWIN_STEP_DATA:
            return {
                ...state,
                skinTwinStepData: action.stepData,
            };
        case SET_SELF_CLASSIFICATION:
            return {
                ...state,
                selfClassification: action.selfClassification,
            };
        case SET_IS_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.authentication,
                //jwtToken: action.authentication === false ? null : action.jwtToken,
            };
        case SET_COUNTRY_CODE:
            return {
                ...state,
                countryCode: action.countryCode,
            };
        case SET_JWT_TOKEN:
            return {
                ...state,
                jwtToken: action.jwtToken,
            };
        case SET_JWT_REFRESH_TOKEN:
            return {
                ...state,
                jwtRefreshToken: action.jwtRefreshToken,
            };
        case SET_MIMECID:
            return {
                ...state,
                mimecid: action.mimecid,
            };
        case SET_JOURNEY_ID:
            return {
                ...state,
                journeyId: action.journeyid,
            };
        case SET_IMAGE_ID:
            return {
                ...state,
                imageId: action.imageId,
            };
        default:
            return state;
    }
};

export default appReducer;
