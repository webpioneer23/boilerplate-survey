
/* --- STATE --- */



type Answer = {
    [key: number] : any
}

type SurveyAnswer = {
    colorHex?: string
    colorRGB?: number[]
    imageUrl: string
    label: string
    value: string
    nextStepColors: number
    colors?: any
    colorsRGB?: any
    answers?: any
}

type Survery = {
    answers: SurveyAnswer[]
    postVariable: string
    question: string
}

interface SurveyState {
    answers: Answer,
    requestPath: string,
    step: number,
    survey: Array<Survery>,
    nextStepColors: number,
    selectedIndex: number,
    selectedIndexes: Array<number | string>,
    ipAddress: string,
    countryCode: string
}

type PhotoItem = {
    status: string,
    imageURL: string
}
interface SurveyProp {
    readonly setShadeCategory: (val: string | string[]) => void,
    readonly setPrimaryTone: (val: string | string[]) => void,
    readonly setUndertoneChoice: (val: Array<string | string[]>) => void,
    readonly setSurveyStepCount: (val: number) => void,
    readonly setSurveyStep: (val: number) => void,
    readonly setSurveyAnswers: (val: Answer) => void,
    readonly setSkinTone: (val: string[] | string) => void,
    readonly selectCoverage: (val: string[] | string) => void,
    readonly steps: number,
    readonly answers: Answer,
    readonly match: any,
    readonly isAuthenticated: boolean,
    readonly jwtToken: string,
    readonly ipAddress: string,
    readonly countryCode: string,
    readonly setMimecid: (val?: string | null) => void,
    readonly setIsAuthenticated: (val: boolean) => void,
    readonly history: any,
    readonly setJWTToken: (val: boolean | null) => void,
    readonly setJWTRefreshToken: (val: boolean | null) => void,
    readonly jwtRefreshToken: string,
    readonly setImageId: (val: number | string | null) => void,
    readonly queryParams: {
        params: string
    },
    readonly method: string
    readonly photoURLs: PhotoItem[]
    readonly onImageRemove: (val: PhotoItem) => void
}

export { SurveyState, SurveyProp, SurveyAnswer, Answer, PhotoItem };
