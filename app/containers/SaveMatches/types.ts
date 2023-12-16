import { RouteProps } from 'react-router';
import * as H from 'history'


interface SaveMatchesProp {
    showBrand: (val: string | null) => void,
    country: string,
    domain: string,
    setUserEmail: (val: string | null) => void,
    location: RouteProps["location"],
    locale: string,
    referrer: string,
    photoURLs: Array<{
        status: string,
        imageURL: string
    }>,
    foundationList: Array<string>,
    preferredSkinTone: string,
    queryParams: {
        params: string
    },
    coverage: Array<string>,
    communication: boolean,
    history: H.History,
    setDomain: (val: string | null) => void,
    setLocale: (val: string | null) => void,
    setReferrer: (val: string | null) => void,
    setUserFirstName: (val: string) => void,
    setUserIpAddress: (val: string | undefined) => void,
    setUserCommunication: (val: boolean) => void,
    jwtToken: string,
    mimecid: string,
    setIsAuthenticated: (val: boolean) => void,
    journeyId: string,
}

interface SaveMatchesState {
    agreementOfMarketingEmail: boolean
    contactForm: { firstName: string, email: string | null, communication: boolean }
    ipAddress?: string
    isNextDisabled: boolean
    lastIsNextDisabled: boolean | null
    nextStep?: boolean
    requestPath: string
    skipRequestPath?: string
}

export { SaveMatchesProp, SaveMatchesState }