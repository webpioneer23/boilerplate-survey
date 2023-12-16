/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import mixpanel from 'mixpanel-browser';
import ReactGA from 'react-ga4';
import {
    setUserShadeCategory,
    setUserPrimaryTone,
    setUndertoneChoice,
    setUserSurveyStepCount,
    setUserSurveyStep,
    setUserSurveyAnswers,
    selectSkinTone,
    selectCoverage,
    setIsAuthenticated,
    setJWTToken,
    setMimecid,
    setJWTRefreshToken,
    setImageId,
    removePhoto
} from 'app/actions';
import axios from 'axios';
import publicIp from 'react-public-ip';
import Button from '../../components/Button/Button';
import StepCounter from '../../components/StepCounter/StepCounter';
import StepTitle from '../../components/StepTitle/StepTitle';
import Loader from '../../components/Loader';
import checkIcon from '../../images/icons/check-circle/check-circle.png';
import checkIcon2x from '../../images/icons/check-circle/check-circle@2x.png';
import checkIcon3x from '../../images/icons/check-circle/check-circle@3x.png';

import 'react-dropdown/style.css';
import '../../components/Dropdown/Dropdown.scss';
import './SurveyPage.scss';
import { Answer, PhotoItem, SurveyAnswer, SurveyProp, SurveyState } from './types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const SurveyPage = ({ match }) => {

    const undertone = useSelector(state => state.app.undertone);
    const referrer = useSelector(state => state.app.referrer);
    const steps = useSelector(state => state.app.steps);
    const answers = useSelector(state => state.app.answers);
    const isAuthenticated = useSelector(state => state.app.isAuthenticated);
    const jwtToken = useSelector(state => state.app.jwtToken);
    const mimecid = useSelector(state => state.app.mimecid);
    const countryCode = useSelector(state => state.app.countryCode);
    const ipAddress = useSelector(state => state.app.ipAddress);
    const queryParams = useSelector(state => state.app.queryParams);
    const primaryTone = useSelector(state => state.app.primaryTone);
    const secondaryTone = useSelector(state => state.app.secondaryTone);
    const jwtRefreshToken = useSelector(state => state.app.jwtRefreshToken);
    const photoURLs = useSelector(state => state.app.photoURLs);

    const dispatch = useDispatch();


    const setShadeCategory = (category: string) => {
        dispatch(setUserShadeCategory(category));
    }
    const setPrimaryTone = (primaryTone: string[] | string) => {
        dispatch(setUserPrimaryTone(primaryTone));
    }
    const setUndertoneChoice = (undertoneChoice: Array<string | string[]>) => {
        dispatch(setUndertoneChoice(undertoneChoice));
    }
    const setSurveyStepCount = (count: number) => {
        dispatch(setUserSurveyStepCount(count));
    }
    const setSurveyStep = (step: number) => {
        dispatch(setUserSurveyStep(step));
    }
    const setSurveyAnswers = (answers: Answer) => {
        dispatch(setUserSurveyAnswers(answers));
    }
    const setSkinTone = (skinTone: string | string[]) => {
        dispatch(selectSkinTone(skinTone));
    }
    const selectCoverage = (coverage: string[] | string) => {
        dispatch(selectCoverage(coverage));
    }
    const setIsAuthenticated = (status: boolean) => {
        dispatch(setIsAuthenticated(status));
    }
    const setJWTToken = (jwtToken: boolean | null) => {
        dispatch(setJWTToken(jwtToken));
    }
    const setMimecid = (mimecid?: string | null) => {
        dispatch(setMimecid(mimecid));
    }
    const setJWTRefreshToken = (jwtRefreshToken: boolean | null) => {
        dispatch(setJWTRefreshToken(jwtRefreshToken));
    }
    const setImageId = (imageId: number | string | null) => {
        dispatch(setImageId(imageId));
    }
    const onImageRemove = photoURL => dispatch(removePhoto(photoURL))

    const method = 'survey?surveyType=image&locale=en_US';

    const [state, setState] = useState(
        {
            answers: answers || {},
            requestPath: match.url,
            step: steps || 1,
            survey: [],
            nextStepColors: 0,
            selectedIndex: -1,
            selectedIndexes: [],
            ipAddress: '',
            countryCode: ''
        }
    )

    const history = useHistory();

    useEffect(() => {
        const { answers, step } = state;
        console.log('surveyr use effect', isAuthenticated, answers, step)

        if (isAuthenticated) {

            if (step > 1) {

                loadSurvey(answers[0]);

            } else {

                setSurveyStep(1)
                console.log('before load suvery')
                loadSurvey();
                console.log('after load suvery')

            }

        } else {

            setIsAuthenticated(false);
            history.push('/?refresh=true');

            //this.auth(); // Don't load survey after since auth() does this

        }
    }, [])


    const loadSurvey = async (complexion?: string | string[]) => {
        let params = '';
        console.log('here')
        if (complexion !== undefined) {
            params = `&complexion=${complexion}`;
        }

        // remove old photos in first step
        if (state.step === 1) {
            photoURLs.map((photoItem: PhotoItem) => {
                if (photoItem.status === 'success') {
                    onImageRemove(photoItem)
                }
            })
        }

        setState({ ...state, survey: [] });
        await axios({
            method: 'get',
            url: process.env.ENDPOINT_URL + method + params,
            headers: {
                Authorization: jwtToken,
                'Access-Control-Allow-Headers': 'sentry-trace, baggage',
            },
        })
            .then((response) => {
                console.log({ response })



                /*

                Testing 401 errors

                var testLoop = new URLSearchParams(this.props.location.search).get("tokenRefreshed");


                if(testLoop!==true){

                    //Test 401 errors
                    this.props.setIsAuthenticated(false);
                    this.props.history.push('/?refresh=true');
                    //return null;

                }

                */


                if (response.data.survey.steps.length) {
                    // INFO: Delete complexion temporarily.
                    // Update step index mapping in the nextStep(), validateNextStep(), onSelect()
                    setState({
                        ...state,
                        survey: response.data.survey.steps.filter((item, idx) => idx !== 5),
                    });
                    const { step, survey } = state;
                    // const { setSurveyStepCount } = this.props;
                    // TODO: Clarify with the client if total steps cound should be dynamic
                    setSurveyStepCount(8);

                    // Setting path to end survey on cases when returning to survey
                    if (step === survey.length) {
                        setState({
                            ...state,
                            requestPath: '/upload/option',
                        });
                    }
                }
            })
            .catch((error) => {
                console.log('error, ', error)
                if (error.response?.status === 401) {
                    console.log('error,--- ', error)

                    setIsAuthenticated(false);
                    history.push('/?refresh=true');
                }
            });
    }

    /**
     * IF/ELSE due to inconsistent API results to capture correct value
     *
     * @param item
     */
    const onSelect = (item: SurveyAnswer, idx: number) => {
        let answers = {
            ...state.answers,
            // eslint-disable-next-line no-nested-ternary
            [state.step - 1]: item.label ? item.label : item.colorRGB ? item.colorRGB : item,
        };
        // Coverage multiselect options
        if ([2, 4].indexOf(state.step) !== -1) {
            // Selected indexes
            let selectedIndexes: Array<number | string> = [];

            // STEP 2 only. Max 2 options + reset previously selected value.
            if ([2].indexOf(state.step) !== -1 && !state.selectedIndexes.includes(idx) && state.selectedIndexes.length > 1) {
                selectedIndexes = state.selectedIndexes.filter((it) => it !== state.selectedIndexes[state.selectedIndexes.length - 2]);
                selectedIndexes = [idx, ...selectedIndexes];
                // Else multiple select
            } else if (state.selectedIndexes.includes(idx)) {
                selectedIndexes = state.selectedIndexes.filter((it) => it !== idx);
            } else {
                selectedIndexes = [idx, ...state.selectedIndexes];
            }
            // Answers
            // eslint-disable-next-line no-nested-ternary
            const answer = item.label ? item.label : item.colorRGB ? item.colorRGB : item;
            let answers: { [key: number]: any } = {
                ...state.answers,
                [state.step - 1]: [answer],
            };

            if (Object.prototype.hasOwnProperty.call(state.answers, state.step - 1)) {
                if (state.answers[state.step - 1].includes(answer)) {
                    answers = state.answers[state.step - 1].filter((ans) => ans !== answer);
                    answers = {
                        ...state.answers,
                        [state.step - 1]: answers,
                    };
                } else {
                    answers = {
                        ...state.answers,
                        [state.step - 1]: [answer, ...state.answers[state.step - 1]],
                    };
                }
            }

            setState({
                ...state,
                answers,
                selectedIndexes,
                nextStepColors: item.nextStepColors ? item.nextStepColors : state.nextStepColors,
            })
        }

        setState({
            ...state,
            answers,
            selectedIndex: idx,
            nextStepColors: item.nextStepColors ? item.nextStepColors : state.nextStepColors,
        })
    };

    /**
     * TODO URL params change
     *
     * @param e
     * @param skipStep
     */
    const nextStep = async (e: React.MouseEvent<HTMLElement>, skipStep?: boolean) => {
        const { answers, step, survey } = state;
        // const { setSurveyStep, setSurveyAnswers } = this.props;
        console.log({ answers, step, survey })

        if (step < 5) {
            setSurveyStep(step + 1);
        }

        setSurveyAnswers(answers);

        // eslint-disable-next-line no-shadow
        // const { setShadeCategory, setPrimaryTone, setUndertoneChoice, setSkinTone, selectCoverage } = this.props;
        if (validateNextStep(answers, step) && !skipStep) {
            e.preventDefault();
            return;
        }

        // Store answers into global state based on step sequence
        // eslint-disable-next-line default-case
        if (answers && answers[step - 1]) {
            switch (step) {
                case 1:
                    setShadeCategory(answers[step - 1]);
                    await loadSurvey(`${answers[step - 1]}`);
                    break;
                case 2:
                    setPrimaryTone(answers[step - 1]);
                    break;
                case 3:
                    setUndertoneChoice([answers[step - 1]]);
                    break;
                case 4:
                    selectCoverage(answers[step - 1]);
                    break;
                case 5:
                    setSkinTone(answers[step - 1]);
                    break;
                case 6:
                    setSkinTone(answers[step - 1]);
                    break;
            }
        }


        setState({
            ...state,
            step: step + 1,
            selectedIndex: -1,
            selectedIndexes: [],
        });

        if (step + 1 > 3) {
            setState({
                ...state,
                nextStepColors: 0,
            });
        }

    };

    /**
     * @param item
     * @param index
     * @returns {*}
     */
    const renderAnswers = (item: SurveyAnswer, index: number) => {
        if (!item) {
            return <div key={`Survey-Item-${index}`} className="Survey-Item" />;
        }
        const { selectedIndex, selectedIndexes } = state;
        let mainElementStyle = {};
        let innerElementStyle = {};
        let toneColor = {};
        if (state.step < 4) {
            mainElementStyle = { backgroundImage: `url(${item.imageUrl})` };
            toneColor = { backgroundColor: `${item.colorHex}` };
        } else {
            innerElementStyle = { backgroundImage: `url(${item.imageUrl})` };
        }
        return (
            <div
                role="button"
                tabIndex={index}
                className={`Survey-Item Survey-Item-${index} ${selectedIndex === index || selectedIndexes.includes(index) ? 'Selected' : ''}`}
                key={`Survey-Item-${index}`}
                onClick={() => onSelect(item, index)}
                onKeyPress={() => onSelect(item, index)}
            >
                <div className="Survey-Item-Shade">
                    <div className="Survey-Item-Element" style={mainElementStyle}>
                        <div className="Survey-Item-Element-Gradient-Background">
                            <div className="Survey-Item-Element-Tick-Container" style={innerElementStyle}>
                                <img src={checkIcon} srcSet={`${checkIcon2x} 2x, ${checkIcon3x} 3x`} alt="Check" />
                            </div>
                        </div>
                        <div className="Survey-Item-Element-Tone-Container">
                            <div style={toneColor} />
                        </div>
                    </div>
                    <p>{item.label ? item.label : (index + 10).toString(36).toUpperCase()}</p>
                </div>
            </div>
        );
    }

    const rgb = (item) => {
        // eslint-disable-next-line no-prototype-builtins
        if (item.hasOwnProperty('colorRGB')) {
            return item.colorRGB.join(', ');
        }

        return item.join(', ');
    }

    const validateNextStep = (answers, step) => {
        const { selectedIndexes } = state;
        console.log({ answers, step, selectedIndexes })
        if (step === 2 || step === 4) {
            return !selectedIndexes.length;
        }
        return !answers[step - 1];
    }


    // const { requestPath, step, survey, answers, nextStepColors } = state;
    if (!state.survey.length) {
        return <Loader step={state.step} />;
    }

    const getOptionList = () => {
        const { answer, step } = state;
        let optionList: Array<SurveyAnswer | null> = [];
        if (Object.hasOwnProperty.call(state.survey[state.step - 1]?.answers[state.nextStepColors], 'colors')) {
            optionList = state.survey[state.step - 1]?.answers[state.nextStepColors].colors;
        } else if (Object.hasOwnProperty.call(state.survey[state.step - 1]?.answers[state.nextStepColors], 'colorsRGB')) {
            optionList = state.survey[state.step - 1]?.answers[state.nextStepColors].colorsRGB;
        } else {
            optionList = state.survey[state.step - 1]?.answers;
        }

        if (optionList && optionList.length % 2 !== 0) {
            optionList = [...optionList, null];
        }
        console.log({ optionList, step })
        return optionList;
    }



    mixpanel.init(process.env.MIXPANEL_TOKEN);
    mixpanel.track(`Viewed Survey Step ${state.step}`, { "customer": process.env.CLIENT_USER });
    ReactGA.initialize(process.env.GOOGLE_ANALYTICS_ID || "");
    ReactGA.event({
        category: "User",
        action: `Viewed Survey Step ${state.step}`,
    });

    return (
        <div className={`SurveyPage SurveyPage-${state.step}`}>
            <StepCounter step={state.step} />
            <StepTitle title={state.survey[state.step - 1].question} />
            <section className="Survey-Options">{getOptionList()?.map((item: SurveyAnswer, index: number) => renderAnswers(item, index))}</section>
            {state.step !== state.survey.length ? (
                <Button disabled={validateNextStep(state.answers, state.step)} onClick={(e: React.MouseEvent<HTMLElement>) => nextStep(e)} requestPath={state.requestPath}>
                    Next
                </Button>
            ) : (
                <Button disabled={validateNextStep(state.answers, state.step)} requestPath='/upload/option'>
                    Next
                </Button>
            )}

            <div className="Skip-Step">
                <Button onClick={(e: React.MouseEvent<HTMLElement>) => nextStep(e, true)} requestPath={state.requestPath}>
                    Skip this step
                </Button>
            </div>
        </div>
    );

}


export default SurveyPage;
