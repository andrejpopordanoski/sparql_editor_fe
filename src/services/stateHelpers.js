import { StateStatus } from 'redux/core/StateStatus';

// const stateHasItems = obj => obj && obj === StateStatus.LOADED && obj.data && obj.data.length > 0;

// const stateIsEmpty = obj => obj && obj === StateStatus.LOADED && (!obj.data || obj.data.length === 0);

const stateIsLoading = obj => !obj || obj.status === StateStatus.LOADING;

const stateIsNotInitialized = obj => !obj || obj.status === StateStatus.NOT_INITIALIZED;

const stateIsNotReady = obj => !obj || obj.status <= StateStatus.LOADING;

const stateIsLoaded = obj => obj.status === StateStatus.LOADED;

const stateHasFailed = obj => obj.status === StateStatus.ERROR;

export { stateIsLoading, stateIsNotInitialized, stateIsNotReady, stateIsLoaded, stateHasFailed };
