import { ActionType } from 'typesafe-actions';
import { History } from 'history';


/* --- EXPORTS --- */

type EmailPageState = {
    requestPathEmail: string
    requestPathResult: string
    resultId: string | null
};

interface EmailPageProp {
    countryCode: string,
    coverage: Array<string>,
    undertoneChoice: Array<string>,
    jwtToken: string,
    mimecid: string,
    imageId: string | null,
    primaryTone: Array<string>,
    preferredSkinTone: string,
    selfClassifiedComplexion: string,
    journeyId: string,
    history: History,
    setIsAuthenticated: (val: boolean) => void,
    setSetJourneyId: (val: string) => void,
    undertone: string | null
};

export { EmailPageProp, EmailPageState };
