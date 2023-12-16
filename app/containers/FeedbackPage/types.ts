import { ActionType } from 'typesafe-actions';
import { RouteComponentProps } from 'react-router';
import * as H from "history";


/* --- EXPORTS --- */
export interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}


type Product = {
    productColor?: string
    imageURL?: string
    brand?: string
    name?: string
    productId?: string
    shade?: string
}

type FeedbackPageState = {
    loading: boolean
    mimecid: string | null
    product: Product
    purchaseId: string | null
    searchId: string | null
    submitted: boolean
    vote: number | string | null
    voteSummitedFailedStatus: boolean
};

interface FeedbackPageProp<P> {
    coverage: Array<string>,
    undertoneChoice: Array<string>,
    jwtToken: string,
    mimecid: string,
    imageId: string | null,
    primaryTone: Array<string>,
    preferredSkinTone: string,
    selfClassifiedComplexion: string,
    journeyId: string,
    history: H.History,
    setIsAuthenticated: (val: boolean) => void,
    setSetJourneyId: (val: string) => void,
    undertone: string | null,
    match: match<P>
};

export { FeedbackPageProp, FeedbackPageState };
