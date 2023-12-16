/*
 * Action types
 */
import { Answer } from '../SurveyPage/types'

export const SHOW_BRAND = 'SHOW_BRAND';
export const SELECT_COUNTRY = 'SELECT_COUNTRY';
export const UPLOAD_PHOTO = 'UPLOAD_PHOTO';
export const REMOVE_PHOTO = 'REMOVE_PHOTO';
export const SET_FOUNDATION = 'SET_FOUNDATION';
export const SELECT_SKIN_TONE = 'SELECT_SKIN_TONE';
export const SET_USER_ID = 'SET_USER_ID';
export const RESET_USER_DATA = 'RESET_USER_DATA';
export const TOGGLE_UNDERTONE = 'TOGGLE_UNDERTONE';
export const SET_UNDERTONE_CHOICE = 'SET_UNDERTONE_CHOICE';
export const SET_USER_EMAIL = 'SET_USER_EMAIL';
export const SET_USER_FIRSTNAME = 'SET_USER_FIRSTNAME';
export const SET_QUERY_PARAMS = 'SET_QUERY_PARAMS';
export const SET_USER_IP_ADDRESS = 'SET_USER_IP_ADDRESS';
export const SET_USER_COMMUNICATION = 'SET_USER_COMMUNICATION';
export const SET_USER_COVERAGE = 'SET_USER_COVERAGE';
export const SET_USER_SHADE_CATEGORY = 'SET_USER_SHADE_CATEGORY';
export const SET_USER_PRIMARY_TONE = 'SET_USER_PRIMARY_TONE';
export const SET_USER_SECONDARY_TONE = 'SET_USER_SECONDARY_TONE';
export const SET_USER_SURVEY_STEPS = 'SET_USER_SURVEY_STEPS';
export const SET_USER_SURVEY_STEP = 'SET_USER_SURVEY_STEP';
export const SET_USER_SURVEY_ANSWERS = 'SET_USER_SURVEY_ANSWERS';
export const EMIT_PHOTO_UPLOAD_ERROR = 'EMIT_PHOTO_UPLOAD_ERROR';
export const SET_REFERRER = 'SET_REFERRER';
export const SET_DOMAIN = 'SET_DOMAIN';
export const SET_LOCALE = 'SET_LOCALE';
export const SET_SKIN_TWIN_STEP = 'SET_SKIN_TWIN_STEP';
export const SET_SKIN_TWIN_STEP_DATA = 'SET_SKIN_TWIN_STEP_DATA';
export const SET_SELF_CLASSIFICATION = 'SET_SELF_CLASSIFICATION';
export const SET_SKU = 'SET_SKU';
export const SET_PRODUCT_ID = 'SET_PRODUCT_ID';
export const SET_GROUP_ID = 'SET_GROUP_ID';
export const SET_AFF_ID = 'SET_AFF_ID';
export const SET_PB_ID = 'SET_PB_ID';
export const SET_IS_AUTHENTICATED = 'SET_IS_AUTHENTICATED';
export const SET_JWT_TOKEN = 'SET_JWT_TOKEN';
export const SET_MIMECID = 'SET_MIMECID';
export const SET_JOURNEY_ID = 'SET_JOURNEY_ID';
export const SET_IMAGE_ID = 'SET_IMAGE_ID';
export const SET_JWT_REFRESH_TOKEN = 'SET_JWT_REFRESH_TOKEN';
export const SET_COUNTRY_CODE = 'SET_COUNTRY_CODE';
export const SET_ACCEPTED_BIOMETRICS = 'SET_ACCEPTED_BIOMETRICS';

export const setAcceptedBiometrics = (acceptBio: boolean) => ({
    type: SET_ACCEPTED_BIOMETRICS,
    acceptBio,
});

export const showBrand = (brand: string) => ({
    type: SHOW_BRAND,
    brand,
});

export const selectCountry = (country: string) => ({
    type: SELECT_COUNTRY,
    country,
});

export const uploadPhoto = (photoURL: string) => ({
    type: UPLOAD_PHOTO,
    photoURL,
});

export const removePhoto = (photoURL: string) => ({
    type: REMOVE_PHOTO,
    photoURL,
});

export const setFoundation = (foundationList: string[]) => ({
    type: SET_FOUNDATION,
    foundationList,
});

export const selectSkinTone = (skinTone: string | string[]) => ({
    type: SELECT_SKIN_TONE,
    skinTone,
});

export const setUserId = (userId: string) => ({
    type: SET_USER_ID,
    userId,
});

export const resetUserData = () => ({
    type: RESET_USER_DATA,
});

export const toggleUnderTone = (undertone: string) => ({
    type: TOGGLE_UNDERTONE,
    undertone,
});

export const setUndertoneChoice = (undertoneChoice: Array<string | string[]>) => ({
    type: SET_UNDERTONE_CHOICE,
    undertoneChoice,
});

export const setUserEmail = (email: string) => ({
    type: SET_USER_EMAIL,
    email,
});

export const setUserFirstName = (firstName: string) => ({
    type: SET_USER_FIRSTNAME,
    firstName,
});

export const setQueryParams = (queryParams: string) => ({
    type: SET_QUERY_PARAMS,
    queryParams,
});

export const setUserIpAddress = (ipAddress: string) => ({
    type: SET_USER_IP_ADDRESS,
    ipAddress,
});

export const setCountryCode = (countryCode: string) => ({
    type: SET_COUNTRY_CODE,
    countryCode,
});

export const setUserCommunication = (communication: string) => ({
    type: SET_USER_COMMUNICATION,
    communication,
});

export const setUserShadeCategory = (shadeCategory: string) => {
    return ({
        type: SET_USER_SHADE_CATEGORY,
        shadeCategory,
    });
}

export const setUserPrimaryTone = (primaryTone: string | string[]) => ({
    type: SET_USER_PRIMARY_TONE,
    primaryTone,
});

export const setUserSecondaryTone = (secondaryTone: string) => ({
    type: SET_USER_SECONDARY_TONE,
    secondaryTone,
});

export const setUserSurveyStepCount = (surveySteps: number) => ({
    type: SET_USER_SURVEY_STEPS,
    surveySteps,
});

export const setUserSurveyStep = (surveyStep: number) => ({
    type: SET_USER_SURVEY_STEP,
    surveyStep,
});

export const setUserSurveyAnswers = (surveyAnswers: Answer) => ({
    type: SET_USER_SURVEY_ANSWERS,
    surveyAnswers,
});

export const setSku = (sku: string) => ({
    type: SET_SKU,
    sku,
});

export const setProductId = (productId: string) => ({
    type: SET_PRODUCT_ID,
    productId,
});

export const setGroupId = (groupId: string) => ({
    type: SET_GROUP_ID,
    groupId,
});

export const setAffId = (affId: string) => ({
    type: SET_AFF_ID,
    affId,
});

export const setPbId = (pbId: string) => ({
    type: SET_PB_ID,
    pbId,
});

export const setReferrer = (referrer: string) => ({
    type: SET_REFERRER,
    referrer,
});

export const setDomain = (domain: string) => ({
    type: SET_DOMAIN,
    domain,
});

export const setLocale = (locale: string) => ({
    type: SET_LOCALE,
    locale,
});

export const selectCoverage = (coverage: string[] | string) => ({
    type: SET_USER_COVERAGE,
    coverage,
});

export const emitPhotoUploadError = (error: string) => ({
    type: EMIT_PHOTO_UPLOAD_ERROR,
    error,
});

export const moveToSkinTwinStep = (complexion, userId, primaryTone, secondaryTone) => ({
    type: SET_SKIN_TWIN_STEP,
    complexion,
    userId,
    primaryTone,
    secondaryTone,
});

export const updateSkinStepData = (stepData) => ({
    type: SET_SKIN_TWIN_STEP_DATA,
    stepData,
});

export const selectSelfClassification = (selfClassification) => ({
    type: SET_SELF_CLASSIFICATION,
    selfClassification,
});

/* export const setIsAuthentication = (authentication) => ({
    type: SET_IS_AUTHENTICATION,
    authentication,
}); */

export const setIsAuthenticated = (authentication: boolean) => ({
    type: SET_IS_AUTHENTICATED,
    authentication,
});

export const setJWTToken = (jwtToken: boolean | null) => ({
    type: SET_JWT_TOKEN,
    jwtToken,
});

export const setJWTRefreshToken = (jwtRefreshToken: boolean | null) => ({
    type: SET_JWT_REFRESH_TOKEN,
    jwtRefreshToken,
});

export const setMimecid = (mimecid?: string | null) => ({
    type: SET_MIMECID,
    mimecid,
});

export const setJourneyId = (journeyid) => ({
    type: SET_JOURNEY_ID,
    journeyid,
});

export const setImageId = (imageId: number | string | null) => ({
    type: SET_IMAGE_ID,
    imageId,
});
