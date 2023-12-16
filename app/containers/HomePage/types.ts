import { RouteProps } from 'react-router';
import { history } from 'history'

interface HomePageProps {
    isAuthenticated: boolean,
    jwtToken: string,
    setSurveyStep: (val: number) => void,
    setMimecid: (val: string | null) => void,
    setIsAuthenticated: (val: boolean) => void,
    setJWTToken: (val: string) => void,
    setJWTRefreshToken: (val: string) => void,
    jwtRefreshToken: string,
    setImageId: (val: string) => void,
    queryParams: {
        params: string
    },
    setDomain: (val: string | null) => void,
    setLocale: (val: string | null) => void,
    setReferrer: (val: string | null) => void,
    resetUserData: () => void,
    history: history.History,
    setSku: (val: string | null) => void,
    setProductId: (val: string | null) => void,
    setGroupId: (val: string | null) => void,
    setAffId: (val: string | null) => void,
    setPbId: (val: string | null) => void,
    setQueryParams: (val: {
        [key: number]: boolean | number
    }) => void,
    setUserIpAddress: (val: string) => void,
    setCountryCode: (val: string) => void,
    location: RouteProps['location']
    mimecid: string
}

interface HomePageState {
    requestPath: string,
    mimeCid: string,
    jwtToken: string,
    jwtRefreshToken: string,
    imageId: string,
    ipAddress: string,
    countryCode: string,
}

export { HomePageProps, HomePageState }