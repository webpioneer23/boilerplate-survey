import { Saga } from 'redux-saga';
import { Reducer, Store } from 'redux';
import { SagaInjectionModes } from 'redux-injectors';

import { RouterState } from 'connected-react-router';
import { ContainerState as LanguageProviderState } from 'containers/LanguageProvider/types';


export interface InjectSagaParams {
    // key: keyof ApplicationRootState;
    key: any;
    saga: Saga;
    mode?: string;
}

export interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}


export type CountryType = {
    name: string,
    iso2: string,
    dialCode: string,
    priority: number,
    areaCodes: string[] | null,
    language: string | null,
    sample?: string
};

export interface InjectedStore extends Store {
    injectedReducers: any;
    injectedSagas: any;
    runSaga(saga: Saga<any[]> | undefined, args: any | undefined): any;
  }
  