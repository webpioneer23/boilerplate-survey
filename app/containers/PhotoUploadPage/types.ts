import { History } from 'history'
import { RouteProps } from 'react-router';
import { match } from 'types';

interface PhotoIndexProps<P> {
    history: History
    location: RouteProps['location']
    match: match<P>,
    photoURLs: Array<{
        id: number
        imageURL: string
        status: string
    }>
    staticContext: undefined | string
}

interface PhotoIndexState {
    isNextDisabled: boolean
    isSkipDisabled: boolean
    requestPath: string
    skipRequestPath: string
    lastIsNextDisabled: boolean | null
    lastIsSkipDisabled: boolean | null
}

export { PhotoIndexProps, PhotoIndexState }