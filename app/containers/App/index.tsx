/* eslint-disable prettier/prettier */
/**
 *
 * App.tsx
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Route } from 'react-router-dom';
import injectSaga from 'utils/injectSaga';
import { DAEMON } from 'utils/constants';
import saga from 'containers/App/saga';
import InstructionsPage from 'containers/InstructionsPage/Loadable';
import SurveyPage from 'containers/SurveyPage/Loadable';
import Reload from 'containers/Reload/Loadable';
import UploadOptionPage from 'containers/UploadOptionPage/Loadable';
import PhotoUploadPage from 'containers/PhotoUploadPage/Loadable';
import EmailPage from 'containers/EmailPage/Loadable';
import ResultsPage from 'containers/ResultsPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import FeedbackPage from 'containers/FeedbackPage/Loadable';
import SaveMatches from 'containers/SaveMatches/Loadable'
import LegalPage from 'containers/LegalPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import HomePage from "../HomePage";
import * as Sentry from "@sentry/react";

import '../../style/sass/global.scss';

function App() {
    return (
        <div>
            <Helmet
                titleTemplate={process.env.PAGE_TITLE}
                defaultTitle={process.env.PAGE_TITLE}
            >
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="theme-color" content="#ffffff" />
                <script type="text/javascript">
                    {`
                        var browserLocale = navigator.language;
                        var _iub = _iub || [];
                        _iub.csConfiguration = {"ccpaAcknowledgeOnDisplay":false,"whitelabel":true,"lang":"en","siteId":1684078,"floatingPreferencesButtonColor":"#ffffff","floatingPreferencesButtonCaptionColor":"#010101","countryDetection":true,"enableCcpa":true,"cookiePolicyId":47909296,"privacyPolicyUrl":"https://www.getmime.com/privacy","cookiePolicyUrl":"https://www.getmime.com/privacy", "banner":{ "acceptButtonDisplay":true,"customizeButtonDisplay":true,"acceptButtonColor":"#0073CE","acceptButtonCaptionColor":"white","customizeButtonColor":"#DADADA","customizeButtonCaptionColor":"#4D4D4D","rejectButtonColor":"#0073CE","rejectButtonCaptionColor":"white","position":"float-bottom-center","textColor":"black","backgroundColor":"white" }};
                        `}
                </script>
                <script type="text/javascript" src="//cdn.iubenda.com/cs/ccpa/stub.js"></script>
                <script
                    type="text/javascript" src="//cdn.iubenda.com/cs/iubenda_cs.js" charSet="UTF-8"
                    async></script>
                <script
                    type="text/javascript"
                    src="//cdn.iubenda.com/cs/iubenda_cs.js"
                    charSet="UTF-8"
                    async
                />
                <script type="text/javascript">
                    {`
                    var _iub = _iub || {}; _iub.cons_instructions = _iub.cons_instructions || [];
                    _iub.cons_instructions.push(["init", {api_key: "T47N26BSNLkO6NUn33t7Z4CtjIuqBon7"}]);
                `}
                </script>
                <script type="text/javascript" src="https://cdn.iubenda.com/cons/iubenda_cons.js" async></script>
            </Helmet>



            <Header />

            <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/legal" component={LegalPage} />
                <Route exact path="/survey" component={SurveyPage} />
                <Route exact path="/survey/r" component={Reload} />
                <Route
                    exact
                    path="/upload/option"
                    component={UploadOptionPage}
                />
                <Route
                    exact
                    path="/instructions"
                    component={InstructionsPage}
                />
                <Route exact path="/photo-upload" component={PhotoUploadPage} />
                <Route
                    exact
                    path="/email"
                    component={EmailPage}
                />
                <Route
                    exact
                    path="/results/:smartId?"
                    component={ResultsPage}
                />
                <Route
                    exact
                    path="/feedback/"
                    component={FeedbackPage}
                />
                <Route
                    exact
                    path="/save/"
                    component={SaveMatches}
                />
                <Route component={NotFoundPage} />
            </Switch>
            <Footer />
        </div>
    );
}

const withSaga = injectSaga({ key: 'app', saga, mode: DAEMON });


// export default Sentry.withProfiler(withSaga(App));
export default withSaga(App);
