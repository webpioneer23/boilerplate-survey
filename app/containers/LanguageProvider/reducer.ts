/*
 *
 * LanguageProvider reducer
 *
 */
import produce from 'immer';

import { CHANGE_LOCALE } from './constants';
import { DEFAULT_LOCALE } from '../../i18n';
import { ContainerState, ContainerActions } from './types';

export const initialState: ContainerState = {
    locale: DEFAULT_LOCALE,
};

/* eslint-disable default-case, no-param-reassign */
const languageProviderReducer = (state: ContainerState = initialState, action: ContainerActions): ContainerState =>
    produce(state, draft => {
        switch (action.type) {
            case CHANGE_LOCALE:
                draft.locale = action.locale;
                break;
        }
    });

export default languageProviderReducer;
