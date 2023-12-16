import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

/* --- STATE --- */

interface AppState {
    readonly email: string,
    readonly showBrand: string,
    readonly country: string,
    readonly countryCode: string,
    readonly photoURLs: Array<{
        status?: string,
        imageURL?: string
        id?: string
    }>,
    readonly foundationList: Array<{
        brandName: string,
        productName: string,
        shadeName: string,
    }>,
    readonly preferredSkinTone: string | string[],
    readonly userId: string | null,
    readonly firstName: string,
    readonly ipAddress: string,
    readonly communication: boolean,
    readonly undertone: null | string,
    readonly coverage: string[],
    readonly photoUploadError: string,
    readonly shadeCategory: string,
    readonly selfClassification: string,
    readonly primaryTone: string[] | string,
    readonly secondaryTone: string[],
    readonly undertoneChoice: string[],
    readonly surveyStepsCount: number,
    readonly skinTwinStepData: any,
    readonly isAuthenticated: boolean,
    readonly jwtToken: null | string,
    readonly jwtRefreshToken: null | string,
    readonly mimecid: null | string,
    readonly queryParams: {
        param?: string
    },
    readonly journeyId: null | string,
    readonly imageId: null | string,

    readonly acceptedBiometrics: boolean
}

/* --- ACTIONS --- */
type AppActions = ActionType<typeof actions>;


/* --- EXPORTS --- */

type ContainerState = AppState;
type ContainerActions = AppActions;

export { ContainerState, ContainerActions };
